import { useEffect } from "react";

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log("timer start");
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    // 클린업 함수 : effect함수 재작동하기 전 실행, 모달 컴포넌트가 닫힐 때 실행. 모달 컴포넌트 최초 실행 시에는 작동하지 않음.
    return () => {
      console.log("timer cleaning");
      clearTimeout(timer);
    };
  }, []);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}
