"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FormEvent, startTransition, useState, useTransition } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { storeCookies } from "../../helper/cookies";

export interface LoginResponse {
  success?: boolean;
  message: string;
  token?: string;
  role?: string;
  error?: string;
  statusCode?: string;
}

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [pending] = useTransition();
  const router = useRouter();

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      // ❌ Server / HTTP error
      if (!response.ok) {
        toast.error(data.message || "Terjadi kesalahan server", {
          containerId: "toastLogin",
        });
        return;
      }

      // ✅ Login success
      if (data.success) {
        toast.success(data.message, {
          containerId: "toastLogin",
        });

        startTransition(async function () {
          await storeCookies("token", data.token || "");
          if (data.role === "ADMIN") {
            setTimeout(() => {
              router.push(`/admin/profile`);
            }, 1000);
          } else if (data.role === "CUSTOMER") {
            setTimeout(() => {
              router.push("/customer/profile");
            }, 1000);
          }
        });
      } else {
        // ⚠️ Username / password salah
        toast.warning(data.message, {
          containerId: "toastLogin",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan koneksi", {
        containerId: "toastLogin",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign In</Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="wildannnnn"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
