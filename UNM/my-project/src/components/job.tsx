import { useForm } from "react-hook-form";

export default function Job() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Ajouter un Job
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Champ : Nom du job */}
        <div className="flex flex-col">
          <label
            htmlFor="job_name"
            className="text-gray-700 font-medium mb-1"
          >
            Nom du job
          </label>

          <input
            type="text"
            id="job_name"
            {...register("job_name")}
            placeholder="Ex: Développeur Front-End"
            className="border border-gray-300 rounded-lg px-4 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:border-blue-500 transition"
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                     font-semibold py-2 rounded-lg transition"
        >
          Envoyer
        </button>

      </form>
    </div>
  );
}
