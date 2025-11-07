import React, { useState, useEffect } from "react";
import styles from "../styles/LoginForm.module.css";
import { register, login } from "../services/auth";
import { AxiosError } from "axios"; // ✅ Good for catching backend error details
import { useNavigate } from "react-router-dom";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface ApiError {
  message: string;
}

const LoginForm: React.FC = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signUpData, setSignUpData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Redirect to Dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = localStorage.getItem("userRole");
      if (userRole === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (userRole === "PROFESSOR") {
        navigate("/professor-dashboard");
      } else if (userRole === "STUDENT") {
        navigate("/dashboard");
      } else {
        // Unknown role, fallback
        navigate("/");
      }
    }
  }, [navigate]);

  const handleSignUpClick = () => setIsRightPanelActive(true);
  const handleSignInClick = () => setIsRightPanelActive(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    setter((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(signUpData);
      alert("✅ Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setSignUpData({ firstName: "", lastName: "", email: "", password: "" });
      setIsRightPanelActive(false);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.error(axiosError);
      setError(
        axiosError.response?.data?.message ||
          "❌ Erreur lors de l'inscription. Veuillez réessayer."
      );
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const authData = await login(signInData);
      console.log("✅ Login Success:", authData);

      // Store the token and user data in localStorage
      localStorage.setItem("token", authData.token);
      localStorage.setItem("userRole", authData.role);
      localStorage.setItem("userDetails", JSON.stringify(authData.userDetails));

      // Redirect based on role
      if (authData.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (authData.role === "PROFESSOR") {
        navigate("/professor-dashboard");
      } else if (authData.role === "STUDENT") {
        navigate("/dashboard");
      } else {
        // Unknown role, fallback
        navigate("/");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.error(axiosError);
      setError(
        axiosError.response?.data?.message ||
          "❌ Email ou mot de passe incorrect."
      );
    }
  };

  return (
    <div
      className={`${styles.container} ${
        isRightPanelActive ? styles.rightPanelActive : ""
      }`}
    >
      {/* Sign Up Form */}
      <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
        <form onSubmit={handleSignUpSubmit}>
          <h1>Créer un compte</h1>
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={signUpData.firstName}
            onChange={(e) => handleChange(e, setSignUpData)}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={signUpData.lastName}
            onChange={(e) => handleChange(e, setSignUpData)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={(e) => handleChange(e, setSignUpData)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={signUpData.password}
            onChange={(e) => handleChange(e, setSignUpData)}
            required
          />
          <button type="submit">S'inscrire</button>
          {error && isRightPanelActive && (
            <p className={styles.error}>{error}</p>
          )}
        </form>
      </div>

      {/* Sign In Form */}
      <div className={`${styles.formContainer} ${styles.signInContainer}`}>
        <form onSubmit={handleSignInSubmit}>
          <h1>Se connecter</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signInData.email}
            onChange={(e) => handleChange(e, setSignInData)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={signInData.password}
            onChange={(e) => handleChange(e, setSignInData)}
            required
          />
          <button type="submit">Connexion</button>
          {error && !isRightPanelActive && (
            <p className={styles.error}>{error}</p>
          )}
        </form>
      </div>

      {/* Overlay Panels */}
      <div className={styles.overlayContainer}>
        <div className={styles.overlay}>
          <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
            <h1>Content de vous revoir !</h1>
            <button className={styles.ghost} onClick={handleSignInClick}>
              Se connecter
            </button>
          </div>
          <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
            <h1>Nouveau ici ?</h1>
            <button className={styles.ghost} onClick={handleSignUpClick}>
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
