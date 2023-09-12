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
  let firstTenMessages = res?.messages.slice(0, 10);
  let ids = firstTenMessages.map((item) =>
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
    return axios.post("/api/v1/tasks", body);
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
      let allMessages = filterData.map((item) => {
        let payload = item?.value?.data?.payload;
        let body = atob(
          payload?.parts?.[0]?.body?.data
            ?.replace(/-/g, "+")
            ?.replace(/_/g, "/")
        );
        // subject
        let subject = "";
        for (let i = 0; i < item?.value?.data?.payload.headers.length; i++) {
          if (item?.value?.data?.payload.headers[i].name === "Subject") {
            subject = item?.value?.data?.payload.headers[i].value;
            break;
          }
        }
        // sender
        let from = "";
        for (let i = 0; i < item?.value?.data?.payload.headers.length; i++) {
          if (item?.value?.data?.payload.headers[i].name === "From") {
            from = item?.value?.data?.payload.headers[i].value;
            from = from.split(" ");
            if (from.length === 1) from = from[0].split("@")[0];
            else from = from[0];
            break;
          }
        }
        return {
          from,
          subject,
          body,
        };
      });
      return allMessages;
    })
    .catch((err) => {
      console.log("err", err);
      return err;
    });
};
