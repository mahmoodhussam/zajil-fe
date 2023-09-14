import axios from "axios";

export const getUserID = async (token, setData, navigate) => {
  try {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    let res = await response.json();
    if (res?.error?.code === 401) navigate("/login");
    else getMessages(res.id, token, setData);
  } catch (error) {
    console.log("error", error);
    navigate("/login");
  }
};

const getMessages = async (userId, token, setData) => {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  let res = await response.json();
  let messages = res?.messages;
  let ids = messages.map((item) =>
    axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${item.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
  const body = await getMessagesContent(ids);
  let withoutMessageBody = body.map((item) => ({
    from: item.from,
    subject: item.subject,
  }));
  setData(withoutMessageBody);

  let summurizes = await body.map((item) => {
    let body = item;
    return axios.post(`${process.env.REACT_APP_BE}/api/v1/tasks`, body);
  });
  let result = await getAllSummurizes(summurizes);
  setData((prev) => {
    return prev.map((item, index) => {
      return {
        ...item,
        ...result[index],
      };
    });
  });
};

const getAllSummurizes = async (summurizes) => {
  return await Promise.allSettled(summurizes)
    .then((data) => {
      const summurizeBody = data.map((item) => {
        return {
          body: item.value.data.summarize.summary,
          autio: item.value.data.summarize.autio,
        };
      });
      return summurizeBody;
    })
    .catch((err) => {
      console.log("err", err);
      return [];
    });
};

const getMessagesContent = async (ids) => {
  return await Promise.allSettled(ids)
    .then((data) => {
      // filteration
      const filterData = data.filter((item) => {
        return item?.value?.data?.payload?.parts?.filter(
          (part) => part.mimeType === "text/plain"
        )?.length;
      });
      let todayData = new Date();
      let yesterdayDate = new Date(todayData.getTime());
      yesterdayDate.setDate(todayData.getDate() - 1);
      todayData.setHours(0, 0, 0, 0);
      yesterdayDate.setHours(0, 0, 0, 0);
      let selectedDate = localStorage.getItem("DATE");

      let allMessages = [];
      for (let i = 0; i < filterData.length; i++) {
        let payload = filterData[i]?.value?.data?.payload;
        for (let i = 0; i < payload?.headers.length; i++) {
          if (payload?.headers[i].name === "Date") {
            let date = new Date(payload?.headers[i].value);
            date.setHours(0, 0, 0, 0);
            if (
              (selectedDate === "today" &&
                date.toString() === todayData.toString()) ||
              (selectedDate === "yesterday" &&
                date.toString() === yesterdayDate.toString())
            ) {
              let body = atob(
                payload?.parts?.[0]?.body?.data
                  ?.replace(/-/g, "+")
                  ?.replace(/_/g, "/")
              );
              // subject
              let subject = "";
              for (let i = 0; i < payload?.headers.length; i++) {
                if (payload?.headers[i].name === "Subject") {
                  subject = payload?.headers[i].value;
                  break;
                }
              }
              // sender
              let from = "";
              for (let i = 0; i < payload?.headers.length; i++) {
                if (payload?.headers[i].name === "From") {
                  from = payload?.headers[i].value;
                  from = from.split(" ");
                  if (from.length === 1) from = from[0].split("@")[0];
                  else from = from[0];
                  break;
                }
              }
              allMessages.push({
                body,
                subject,
                from,
              });
            } else {
              break;
            }
          }
        }
      }
      let numberOfFilteration = Number(localStorage.getItem("MAX_NUMBER"));
      let filterNumberOfResult = allMessages.slice(0, numberOfFilteration);
      return filterNumberOfResult;
    })
    .catch((err) => {
      console.log("err", err);
      return err;
    });
};
