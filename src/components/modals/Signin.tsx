"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { FaLock, FaUnlock } from "react-icons/fa6";
import { toast } from "react-toastify";

const Signin = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const change = (value: string, key: "email" | "password") => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });
    if (res?.error) toast(res.error, { type: "error" });
    else if (res?.ok) toast("Signed In", { type: "success" });
    setIsLoading(false);
  };
  const handleGoogleSignin = () => {
    setIsLoading(true);
    signIn("google", { redirect: false });
    setIsLoading(false);
  };
  const handleFacebookSignin = () => {
    setIsLoading(true);
    signIn("facebook", { redirect: false });
    setIsLoading(false);
  };

  return (
    <>
      <Button onPress={onOpen} className="text-black bg-gray-300">
        Sign In
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Hello User!
              </ModalHeader>
              <ModalBody>
                <Input
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => change(e.target.value, "email")}
                ></Input>
                <Input
                  placeholder="Password"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <FaUnlock className="text-xl text-default-400 pointer-events-none" />
                      ) : (
                        <FaLock className="text-xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  value={user.password}
                  onChange={(e) => change(e.target.value, "password")}
                ></Input>
              </ModalBody>
              <ModalFooter className="justify-center flex col">
                <Button
                  disabled={!isLoading}
                  isLoading={isLoading}
                  color="primary"
                  onPress={handleSubmit}
                >
                  Log In
                </Button>
                <Button
                  color="default"
                  className="border-2 border-black/20"
                  onPress={handleGoogleSignin}
                >
                  <FaGoogle /> Google
                </Button>
                <Button
                  color="default"
                  className="border-2 border-black/20"
                  onPress={handleFacebookSignin}
                >
                  <FaFacebook /> Facebook
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Signin;
