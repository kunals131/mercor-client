import React, { ChangeEvent, useState } from "react";
import AuthInput from "../AuthInput";
import { checkInputErrors } from "@/utils/functions";
import { AuthView } from "../Auth.types";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "./RegisterForm.api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const RegisterForm = ({ setAuthView }: Props) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { mutate, isPending: registerLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Registered successfully!");
      setAuthView(AuthView.LOGIN);
    },
    onError: (err: AxiosError<any, any>) => {
      toast.error(err?.response?.data?.messaage || "Something went wrong!");
    },
  });

  const handleSubmit = () => {
    const validation = checkInputErrors(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    if (form.password !== form.confirm_password) {
      setErrors((prev) => ({
        ...prev,
        confirm_password: "Password and confirm password must be same!",
      }));
      return;
    }
    mutate(form);
  };
  return (
    <>
      <div className="text-3xl uppercase font-semibold">Register</div>
      <div className="mt-2 text-white/80">
        Get ready to interact with most amazing chat bot!
      </div>
      <div className="mt-8 w-[80%] space-y-5">
        <AuthInput
          onChange={handleInputChange}
          name="username"
          placeholder="Enter email"
          error={errors["username"]}
          label="Username / Email"
        />
        <div className="grid grid-cols-2 gap-5">
          <AuthInput
            onChange={handleInputChange}
            name="password"
            placeholder="Enter Password"
            error={errors["password"]}
            label="Password"
            type="password"
          />
          <AuthInput
            onChange={handleInputChange}
            name="confirm_password"
            placeholder="Enter Confirm Password"
            error={errors["confirm_password"]}
            label="Confirm Password"
            type="password"
          />
        </div>
      </div>
      <div className="mt-8 flex items-center">
        <button
          onClick={handleSubmit}
          disabled={registerLoading}
          className="px-20 hover:bg-primary/60 hover:text-white transition-all font-[500] py-3 rounded-3xl bg-primary text-secondaryBgElevated"
        >
          {registerLoading ? "Loading.." : "Register"}
        </button>
      </div>
      <div className="mt-8 pl-2 space-y-1 text-sm ">
        <div
          onClick={() => setAuthView(AuthView.LOGIN)}
          className="opacity-70 hover:opacity-100 hover:underline cursor-pointer"
        >
          Already have a account?
        </div>
      </div>
    </>
  );
};

type Props = {
  setAuthView: (view: AuthView) => void;
};

export default RegisterForm;
