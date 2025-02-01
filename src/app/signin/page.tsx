"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

// 타입
import { IAlertProps } from "@/components/Alert/AlertTypes";
import { ITextFieldChangeData } from "@/components/TextField/TextFieldTypes";
import { ISignInInputs } from "./type";

// 컴포넌트
import Alert from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";

// 유틸리티
import { callApi } from "@/utils/api";
import { isEmpty, isValidEmail } from "@/utils/validation";

// 스타일
import styles from "./styles/SignIn.module.scss";

export default function SignIn() {
  const router = useRouter();

  // API 상태
  const [isPending, setIsPending] = useState(false);

  // 서버 응답 상태
  const [alert, setAlert] = useState<IAlertProps>({
    type: "info",
    text: "",
  });

  // 입력 데이터
  const [inputs, setInputs] = useState<ISignInInputs>({
    email: "",
    password: "",
  });

  // 비활성화 여부
  const isDisabled =
    isEmpty(inputs.email) || // 이메일 미입력
    isEmpty(inputs.password) || // 비밀번호 미입력
    !isValidEmail(inputs.email); // 이메일 형식 오류

  /**
   * 알림 초기화
   */
  function clearAlert() {
    setAlert({ type: "info", text: "" });
  }

  /**
   * 입력 데이터 변경
   * @param key 변경할 키
   * @param value 변경할 값
   */
  function onChange(key: keyof ISignInInputs, value: string) {
    setInputs((prevState) => ({ ...prevState, [key]: value }));
  }

  /**
   * 로그인 버튼 클릭
   */
  async function handleClickSignUp() {
    if (isDisabled || isPending) return;

    try {
      clearAlert();

      setIsPending(true);
      const response = await callApi("/users/login", {
        method: "POST",
        body: {
          email: inputs.email,
          password: inputs.password,
        },
      });
      setIsPending(false);

      const responseData = await response.json();
      if (responseData?.token) {
        setCookie("token", responseData.token);
        router.push("/");
      } else {
        // "invalid email", "invalid password"는 서버에서 반환하는 값
        if (["invalid email", "invalid password"].includes(responseData?.error))
          setAlert({
            type: "info",
            text: "이메일 혹은 비밀번호가 올바르지 않습니다.",
          });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        text: "문제가 발생했습니다. 문제를 해결하는 중이오니 잠시 후 다시 시도해주세요.",
      });
      throw new Error(error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* 카드 Header */}
        <div className={styles.header}>
          <img src="/logo.png" alt="블루밍그레이스" className={styles.logo} />
          <h1 className={styles.title}>투자 관리를 더 쉽고, 편리하게.</h1>
        </div>
        {/* 알림 */}
        {alert.text && <Alert type={alert.type} text={alert.text} />}
        {/* 카드 Body */}
        <TextField
          type="text"
          value={inputs.email}
          placeholder="이메일를 입력해주세요."
          label="이메일"
          checkFormatter={(value) => isEmpty(value) || isValidEmail(value)}
          onChange={(data: ITextFieldChangeData) =>
            onChange("email", data.value)
          }
          isDisabled={isPending}
        />
        <TextField
          type="password"
          value={inputs.password}
          placeholder="비밀번호를 입력해주세요."
          label="비밀번호"
          onChange={(data: ITextFieldChangeData) =>
            onChange("password", data.value)
          }
          isDisabled={isPending}
        />
        {/* 카드 Footer */}
        <Button
          value="로그인"
          onClick={handleClickSignUp}
          isPending={isPending}
          isDisabled={isDisabled}
        />
        <div className={styles.seperate}></div>
        <p className={styles.signup}>
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="link">
            무료 회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
