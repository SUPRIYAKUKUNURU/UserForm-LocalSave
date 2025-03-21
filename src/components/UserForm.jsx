import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UserForm = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);

  const validate = () => {
    const tempErrors = {};

    if (!user.firstName.trim()) {
      tempErrors.firstName = "First Name is required";
    } else if (/google/i.test(user.firstName)) {
      tempErrors.firstName = "First Name cannot contain 'Google'";
    }

    if (!user.lastName.trim()) {
      tempErrors.lastName = "Last Name is required";
    } else if (/google/i.test(user.lastName)) {
      tempErrors.lastName = "Last Name cannot contain 'Google'";
    }

    const phoneNumber = user.phoneNumber.trim();
    if (!/^0\d{9}$/.test(phoneNumber)) {
      tempErrors.phoneNumber = "Enter a valid 10-digit phone number starting with 0";
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(user.email)) {
      tempErrors.email = "Enter a valid Email ID";
    }

    if (!user.address.trim()) tempErrors.address = "Address is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phoneNumber") {
      value = value.replace(/\D/g, "");
    }

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const isDuplicate = storedUsers.some(
      (u) => u.email === user.email || u.phoneNumber === user.phoneNumber
    );

    if (isDuplicate) {
      alert("User with this Email or Phone Number already exists!");
      return;
    }

    const newUser = { ...user, id: Date.now() };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("User details saved successfully!");

    setUser({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    setErrors({});
    setUsers(updatedUsers);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  return (
    <>
      <h1 className="text-center">User Details Collection</h1>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white text-center">
                <h3 className="mb-0">User Details Form</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {[
                    { label: "First Name", name: "firstName", type: "text" },
                    { label: "Last Name", name: "lastName", type: "text" },
                    { label: "Phone Number", name: "phoneNumber", type: "text" },
                    { label: "Email ID", name: "email", type: "email" },
                  ].map((field) => (
                    <div className="mb-3" key={field.name}>
                      <label className="form-label fw-bold">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        className="form-control form-control-lg rounded-3"
                        placeholder={`Enter ${field.label}`}
                        value={user[field.name]}
                        onChange={handleChange}
                      />
                      {errors[field.name] && (
                        <div className="text-danger mt-2">{errors[field.name]}</div>
                      )}
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label fw-bold">Address</label>
                    <textarea
                      name="address"
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter Address"
                      value={user.address}
                      onChange={handleChange}
                    ></textarea>
                    {errors.address && (
                      <div className="text-danger mt-1">{errors.address}</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Submit
                  </button>
                </form>
              </div>
            </div>

            {users.length > 0 && (
              <div className="mt-5">
                <h3 className="text-center">Stored User Details</h3>
                <ul className="list-group mt-3">
                  {users.map((u) => (
                    <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center shadow-sm">
                      <div>
                        <strong className="text-primary">{u.firstName} {u.lastName}</strong>
                        <div>📞 {u.phoneNumber} | ✉️ {u.email}</div>
                        <small className="text-muted">🏠 {u.address}</small>
                      </div>
                      <button className="btn btn-danger btn-md" onClick={() => handleDelete(u.id)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForm;
