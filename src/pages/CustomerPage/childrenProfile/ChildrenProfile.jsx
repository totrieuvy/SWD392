import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../config/axios";
import { setSelectedChild } from "../../../redux/features/childrenSelectedSlice";
import "./ChildrenProfile.scss";

function ChildrenProfile() {
  const [children, setChildren] = useState([]);
  const [childDetails, setChildDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redux
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.userId);
  const userName = useSelector((state) => state.user?.userName);
  const selectedChild = useSelector((state) => state.selectedChild?.selectedChild);

  useEffect(() => {
    document.title = "Thông tin trẻ em";
    if (userId) {
      fetchChildren();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (selectedChild?.childId) {
      fetchChildDetails(selectedChild.childId);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await api.get(`user/${userId}`);

      if (response.data.statusCode === 200 && response.data.data.listChildRes) {
        setChildren(response.data.data.listChildRes);

        if (response.data.data.listChildRes.length > 0 && !selectedChild) {
          dispatch(setSelectedChild(response.data.data.listChildRes[0]));
        }
      } else {
        setError("Không thể lấy dữ liệu trẻ em");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDetails = async (childId) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`user/child/${childId}`);

      if (response.data.statusCode === 200) {
        setChildDetails(response.data.data);
      } else {
        setError("Không thể lấy thông tin chi tiết của trẻ");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi lấy thông tin chi tiết");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSelectChild = (child) => {
    dispatch(setSelectedChild(child));
  };

  if (!userId) return <div>Vui lòng đăng nhập để xem thông tin</div>;
  if (loading) return <div className="loading-spinner">Đang tải...</div>;
  if (error) return <div className="error-message">Lỗi: {error}</div>;

  return (
    <div className="children-profile-container">
      <h2 className="profile-title">Thông tin trẻ em của {userName}</h2>

      {children.length === 0 ? (
        <p className="no-children-message">Không có thông tin trẻ em</p>
      ) : (
        <div className="children-grid">
          {children.map((child) => (
            <div
              key={child.childId}
              className={`child-card ${selectedChild?.childId === child.childId ? "selected" : ""}`}
              onClick={() => handleSelectChild(child)}
            >
              <div className="child-avatar">
                {child.gender === "male" ? (
                  <div className="avatar-icon male">👦</div>
                ) : (
                  <div className="avatar-icon female">👧</div>
                )}
              </div>
              <div className="child-info">
                <h3 className="child-name">{child.fullName}</h3>
                <div className="child-details">
                  <p>
                    <span>Ngày sinh:</span> {child.dob}
                  </p>
                  <p>
                    <span>Giới tính:</span> {child.gender === "male" ? "Nam" : "Nữ"}
                  </p>
                </div>
              </div>
              {selectedChild?.childId === child.childId && <div className="selected-indicator">✓</div>}
            </div>
          ))}
        </div>
      )}

      {selectedChild && (
        <>
          <div className="selected-child-details">
            <h3>Thông tin chi tiết</h3>
            {detailsLoading ? (
              <div className="details-loading">Đang tải thông tin chi tiết...</div>
            ) : (
              <div className="details-card">
                <p>
                  <span>Họ và tên:</span> {childDetails?.fullName || selectedChild.fullName}
                </p>
                <p>
                  <span>Ngày sinh:</span> {childDetails?.dob || selectedChild.dob}
                </p>
                <p>
                  <span>Giới tính:</span> {(childDetails?.gender || selectedChild.gender) === "male" ? "Nam" : "Nữ"}
                </p>
                <p>
                  <span>Địa chỉ:</span> {childDetails?.address || selectedChild.address || "Chưa cập nhật"}
                </p>
              </div>
            )}
          </div>

          {childDetails && (
            <div className="vaccination-section">
              <h3>Thông tin tiêm chủng</h3>
              {detailsLoading ? (
                <div className="details-loading">Đang tải thông tin tiêm chủng...</div>
              ) : childDetails.vaccinatedInformation && childDetails.vaccinatedInformation.length > 0 ? (
                <div className="vaccination-grid">
                  {childDetails.vaccinatedInformation.map((vaccine, index) => (
                    <div key={index} className={`vaccine-card ${vaccine.isVaccinated ? "vaccinated" : "pending"}`}>
                      <div className="vaccine-status-indicator">{vaccine.isVaccinated ? "Đã tiêm" : "Chưa tiêm"}</div>
                      <h4 className="vaccine-type">{vaccine.vaccineType}</h4>
                      <div className="vaccine-details">
                        <p>
                          <span>Ngày dự kiến:</span> {new Date(vaccine.scheduleDate).toLocaleDateString("vi-VN")}
                        </p>
                        {vaccine.isVaccinated && vaccine.actualDate && (
                          <p>
                            <span>Ngày thực tế:</span> {new Date(vaccine.actualDate).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-vaccine-container">
                  <p className="no-vaccine-message">Chưa tiêm mũi nào</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ChildrenProfile;
