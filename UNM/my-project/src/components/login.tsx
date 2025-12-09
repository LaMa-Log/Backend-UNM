import { useState } from "react";
import { Stack, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface IFormInput {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<IFormInput>();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const notifySuccess = () => toast.success("Connexion réussie !");
  const notifyError = (message: string) => toast.error(message);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", data);
      localStorage.setItem("token", response.data.token);
      notifySuccess();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la connexion. Vérifiez votre email et votre mot de passe.");
      notifyError(err.response?.data?.message || "Erreur lors de la connexion.");
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        height: "100vh",            // occupe toute la hauteur
        justifyContent: "center",   // centre verticalement
        alignItems: "center",       // centre horizontalement
      }}
    >
      <Typography variant="h5" align="center">Connexion</Typography>

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "300px" }}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register("email", { required: true })}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            {...register("password", { required: true })}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Se connecter
          </Button>
        </Stack>
      </form>
      
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Stack>
  );
}
