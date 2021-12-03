import axios from "axios";

const api = axios.create({
  baseURL: "https://type.fit/api",
});

function getQuotes() {
  return api
    .get("/quotes")
    .then((response) => {
      console.log("RES", response.data);

      if (response.data) {
        return response.data;
      } else {
        console.log("error");
      }
    })
    .catch((error) => {
      console.log("an error happened", error);
      return error;
    });
}

export default getQuotes;
