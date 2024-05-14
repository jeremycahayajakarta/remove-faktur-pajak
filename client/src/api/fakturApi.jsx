const SERVER_BASE_URL = "http://127.0.0.1:5000";

const getAllFaktur = async () => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/faktur`, {
      cache: "no-store",
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const getFakturById = async (id) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/faktur?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};


const getFakturByDate = async (start_date, end_date) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/faktur?start_date=${start_date}&end_date=${end_date}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export default { getAllFaktur, getFakturById, getFakturByDate };
