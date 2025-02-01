"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 타입
import { ISignUpInputs } from "./type";
import { IAlertProps } from "@/components/Alert/AlertTypes";
import { ITextFieldChangeData } from "@/components/TextField/TextFieldTypes";

// 컴포넌트
import Alert from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";

// 유틸리티
import { callApi } from "@/utils/api";
import { isEmpty, isEqual, isValidEmail } from "@/utils/validation";

// 스타일
import styles from "./styles/SignUp.module.scss";

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
  const [inputs, setInputs] = useState<ISignUpInputs>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  // 비활성화 여부
  const isDisabled =
    isEmpty(inputs.email) || // 이메일 미입력
    isEmpty(inputs.password) || // 비밀번호 미입력
    isEmpty(inputs.confirmPassword) || // 비밀번호 확인 미입력
    !isEqual(inputs.password, inputs.confirmPassword) || // 비밀번호 불일치
    !isValidEmail(inputs.email); // 이메일 형식 오류

  /**
   * 입력 데이터 변경
   * @param key 변경할 키
   * @param value 변경할 값
   */
  function onChange(key: keyof ISignUpInputs, value: string) {
    setInputs((prevState) => ({ ...prevState, [key]: value }));
  }

  /**
   * 알림 초기화
   */
  function clearAlert() {
    setAlert({ type: "info", text: "" });
  }

  /**
   * 회원가입 버튼 클릭
   */
  async function handleClickSignUp() {
    if (isDisabled || isPending) return;

    try {
      clearAlert();
      setIsPending(true);
      const response = await callApi("/users.json", {
        method: "POST",
        body: {
          user: {
            email: inputs.email,
            password: inputs.password,
          },
        },
      });
      setIsPending(false);

      if (response.ok) router.push("/signin");
      else {
        const responseData = await response.json();
        if (responseData?.email[0] === "has already been taken")
          setAlert({ type: "info", text: "이미 사용하고 있는 이메일 입니다." });
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
          <h1 className={styles.title}>
            지금 회원가입하고,
            <br />
            편리하게 투자를 관리하세요.
          </h1>
        </div>
        {/* 알림 */}
        {alert.text && <Alert type={alert.type} text={alert.text} />}
        {/* 카드 내용 */}
        <TextField
          type="text"
          value={inputs.email}
          placeholder="사용할 이메일을 입력해주세요."
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
          placeholder="사용할 비밀번호를 입력해주세요."
          label="비밀번호"
          onChange={(data: ITextFieldChangeData) =>
            onChange("password", data.value)
          }
          isDisabled={isPending}
        />
        <TextField
          type="password"
          value={inputs.confirmPassword}
          placeholder="비밀번호를 다시 입력해주세요."
          label="비밀번호 확인"
          checkFormatter={(value) =>
            isEmpty(value) || isEqual(inputs.password, value)
          }
          onChange={(data: ITextFieldChangeData) =>
            onChange("confirmPassword", data.value)
          }
          isDisabled={isPending}
        />
        {/* 카드 Footer */}
        <Button
          value="회원가입"
          onClick={handleClickSignUp}
          isPending={isPending}
          isDisabled={isDisabled}
        />
        <div className={styles.seperate}></div>
        <p className={styles.signup}>
          이미 회원가입을 하셨나요?{" "}
          <Link href="/signin" className="link">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
