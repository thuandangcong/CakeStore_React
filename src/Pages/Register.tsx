import React, { useState } from "react";
import { useRegisterUserMutation } from "../Apis/authApi";
// import { inputHelper, toastNotify } from "../Helper";
import { apiResponse } from "../Interfaces";
import { SD_Roles } from "../Utility/SD";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";
import { inputHelper, toastNotify } from "../Helper";

function Register() {
  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
    name: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const validatePassword = (password: string) => {
    const passwordRequirements = [
      { test: /.{8,}/, message: "Password must be at least 8 characters long." },
      { test: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
      { test: /[a-z]/, message: "Password must contain at least one lowercase letter." },
      { test: /[0-9]/, message: "Password must contain at least one number." },
      { test: /[@$!%*?&]/, message: "Password must contain at least one special character." },
    ];

    const unmetRequirements = passwordRequirements.filter(
      requirement => !requirement.test.test(password)
    );

    if (unmetRequirements.length > 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: unmetRequirements[0].message,
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: "",
      }));
    }
  };

  const validateInput = () => {
    let valid = true;
    let newErrors = { userName: "", password: "", name: "" };

    if (!userInput.userName) {
      newErrors.userName = "Username is required.";
      valid = false;
    }
    if (!userInput.name) {
      newErrors.name = "Name is required.";
      valid = false;
    }
    if (!userInput.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else {
      validatePassword(userInput.password);
      if (errors.password) {
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }
    setLoading(true);
    const response: apiResponse = await registerUser({
      userName: userInput.userName,
      password: userInput.password,
      role: userInput.role,
      name: userInput.name,
    });
    if (response.data) {
      toastNotify("Registeration successful! Please login to continue.");
      navigate("/login");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
    }

    setLoading(false);
  };

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Register</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              required
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
            />
            {errors.userName && <div className="text-danger mt-2">{errors.userName}</div>}
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="name"
              value={userInput.name}
              onChange={handleUserInput}
            />
            {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              required
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
            />
            {errors.password && <div className="text-danger mt-2">{errors.password}</div>}
          </div>
          {/* <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <select
              className="form-control form-select"
              required
              value={userInput.role}
              name="role"
              onChange={handleUserInput}
            >
              <option value="">--Select Role--</option>
              <option value={`${SD_Roles.CUTOMER}`}>Customer</option>
              <option value={`${SD_Roles.ADMIN}`}>Admin</option>
            </select>
          </div> */}
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-success" disabled={loading}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
