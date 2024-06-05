const SERVER_BASE_URL = "http://192.168.31.118:5000";

const getFakturById = async (id) => {
  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/get_faktur_by_id?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const getFakturByDate = async (start_date, end_date) => {
  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/get_faktur_by_date?start_date=${start_date}&end_date=${end_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const removeFaktur = async (invoice_id, year, alasan) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/remove_faktur`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: invoice_id,
        year: year,
        alasan: alasan,
      }),
    });
    const data = response;
    return data;
  } catch (error) {
    console.error("Error removing faktur: ", error);
    throw error;
  }
};

const getAllLog = async () => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/get_all_logs`, {
      cache: "no-store",
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const exportCSV = async (start_date, end_date) => {
  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/export_csv?start_date=${start_date}&end_date=${end_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/csv",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          // "Access-Control-Allow-Headers": "*"
        },
      }
    );
    // const data = response.json();
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DATA_FAKTUR_${start_date}_${end_date}.csv`;
    document.body.appendChild(a); // Append the element to work in Firefox
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const exportExcel = async (start_date, end_date) => {
  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/export_excel?start_date=${start_date}&end_date=${end_date}`,
      {
        method: "GET",
      }
    );
    // const data = response.json();
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DATA_FAKTUR_${start_date}_${end_date}.xlsx`;
    document.body.appendChild(a); // Append the element to work in Firefox
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export default {
  getFakturById,
  getFakturByDate,
  removeFaktur,
  getAllLog,
  exportCSV,
  exportExcel,
};
