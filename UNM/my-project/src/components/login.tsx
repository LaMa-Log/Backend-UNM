import { useState } from "react";
import { Stack, Typography, TextField, Button } from "@mui/material";
import { useForm} from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface IFormInput {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<IFormInput>();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", data);
      console.log("Token reçu :", response.data.token);
      alert("Connexion réussie !");
      navigate("/dashboard");
      localStorage.setItem("token", response.data.token);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <Stack spacing={2} sx={{ width: 300, margin: "auto", mt: 5 }}>
      <Typography variant="h5" align="center">
        Connexion
      </Typography>

      {error && <Typography color="error" align="center">{error}</Typography>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            {...register("email", { required: true })}
          />
          <TextField
            label="Mot de passe"
            type="password"
            {...register("password", { required: true })}
          />

          <Button type="submit" variant="contained" color="primary">
            Se connecter
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
