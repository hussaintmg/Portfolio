import React, { useState, useEffect, useContext ,Suspense} from "react";
import RevealSection from "../Components/RevealSection";
import { toast } from "react-toastify";
import axios from "axios";
import { MainDataContext } from "../../context/MainDataContext";
import "../SCSS/SkillsList.scss";


const DynamicFaIcon = ({ iconName, size = 40, color = "black" }) => {
  const Icon = React.lazy(() =>
    import("react-icons/fa").then((module) => ({ default: module[iconName] }))
  );
  return (
    <Suspense fallback={<span style={{ width: size, height: size }}>...</span>}>
      <Icon size={size} color={color} />
    </Suspense>
  );
};


export default function ServicesEdit() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const [currentServices, setCurrentServices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newIcon, setNewIcon] = useState("");

  const { services } = useContext(MainDataContext);

  useEffect(() => {
    if (services) {
      setCurrentServices(services);
    }
  }, [services]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/skill/get-data`);
      setCurrentServices(res.data.services || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const uploadService = async () => {
    if (!newTitle || !newIcon) return toast.error("Please fill all fields");

    try {
      await axios.post(
        `${apiUrl}/api/skill/upload-service`,
        { title: newTitle, icon: newIcon },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Service uploaded successfully!");
      fetchServices();
      setNewTitle("");
      setNewIcon("");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload service");
    }
  };

  const deleteService = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/skill/delete-service/${id}`);
      toast.success("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete service");
    }
  };

  const handleEdit = (index, service) => {
    setEditIndex(index);
    setEditTitle(service.title);
    setEditIcon(service.icon);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditTitle("");
    setEditIcon("");
  };

  const handleDone = async (id) => {
    if (!editTitle || !editIcon) return toast.error("Please enter all values");

    try {
      await axios.put(
        `${apiUrl}/api/skill/update-service/${id}`,
        { title: editTitle, icon: editIcon },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Service updated successfully!");
      fetchServices();
      handleCancel();
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="icon-up-page">
      <h2 className="section">Services Section</h2>
      <RevealSection trigger="scroll">
        {currentServices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentServices.map((service, index) => (
                <tr
                  key={service._id || index}
                  className={index % 2 === 0 ? "white" : "aqua"}
                >
                  {editIndex === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Service Title"
                          style={{
                            width: "90%",
                            margin: "0 5%",
                            padding: "0.5rem",
                            fontSize: "1.3rem",
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          placeholder="Service Icon (fa-class or URL)"
                          style={{
                            width: "90%",
                            margin: "0 5%",
                            fontSize:"1.3rem",
                            padding: "0.5rem",
                          }}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleDone(service._id)}
                          className="action-btn"
                          style={{ background: "green", color: "white" }}
                        >
                          Done
                        </button>
                        <button
                          onClick={handleCancel}
                          className="action-btn"
                          style={{ background: "orange", color: "white" }}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: "700", fontSize: "1.2rem" }}>
                        {service.title}
                      </td>
                      <td style={{display:"flex",justifyContent:"center",height:"3cm",alignItems:"center",gap:"0.7cm"}}>
                        {service.icon?.startsWith("fa") ? (
                          <i className={service.icon}></i>
                        ) : (
                          service.icon
                        )}
                        <DynamicFaIcon iconName={service.icon} />
                      </td>
                      <td>
                        <button
                          className="action-btn"
                          style={{ background: "yellow", color: "black" }}
                          onClick={() => handleEdit(index, service)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn"
                          style={{ background: "red", color: "white" }}
                          onClick={() => deleteService(service._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p
            style={{
              color: "red",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            No Service Available
          </p>
        )}
        <div className="new-list">
          <div className="input">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Service Title"
              style={{ marginBottom: "0.5rem" }}
            />
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="Service Icon (fa-class or image URL)"
              style={{ marginBottom: "0.5rem" }}
            />
          </div>
          <div className="up-btn">
            <button style={{margin:"0",padding:"0"}} onClick={uploadService}>
              Upload Service
            </button>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
