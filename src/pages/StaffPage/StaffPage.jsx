import { useEffect, useState } from "react";
import api from "../../config/axios";
import "./StaffPage.scss"; 

function StaffPage() {
  const [schedule, setSchedule] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedule();
    document.title = "Staff";

    const interval = setInterval(() => {
      fetchSchedule();
    }, 40000);

    return () => clearInterval(interval);
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await api.get("schedule");
      if (response.data && response.data.data) {
        const sortedData = response.data.data.sort((a, b) => {
          return (
            new Date(b.scheduleDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")) -
            new Date(a.scheduleDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1"))
          );
        });
        setSchedule(sortedData);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckIn = async (childrenName) => {
    setLoading(true);
    try {
      await api.post("schedule/confirm", { childrenName });
      fetchSchedule();
    } catch (error) {
      console.error("Error confirming check-in:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedule = schedule.filter((item) =>
    item.childrenName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="staff-page">
      <div className="container">
        <h1>Lịch tiêm chủng của khách</h1>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Nhập tên trẻ em"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-icon">
              <svg viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tên trẻ em</th>
                <th>Tên phụ huynh</th>
                <th>Tên Vaccine</th>
                <th>Ngày đăng kí chích</th>
                <th>Trạng thái</th>
                <th>Điện thoại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((item, index) => (
                <tr key={index}>
                  <td className="child-name">{item.childrenName}</td>
                  <td>{item.parentsName}</td>
                  <td>{item.vaccineName}</td>
                  <td>{item.scheduleDate}</td>
                  <td>
                    <span className={`status-badge ${item.scheduleStatus.toLowerCase()}`}>{item.scheduleStatus}</span>
                  </td>
                  <td>{item.phoneNumber}</td>
                  <td>
                    <button
                      onClick={() => handleConfirmCheckIn(item.childrenName)}
                      disabled={item.scheduleStatus === "Completed"}
                      className={`confirm-button ${item.scheduleStatus === "Completed" ? "disabled" : ""}`}
                    >
                      {item.scheduleStatus === "Completed" ? "Đã checkin" : " Chưa checkin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchedule.length === 0 && !loading && (
          <div className="no-results">
            <div className="no-results-icon">
              <svg viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </div>
            <h3>No records found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffPage;
