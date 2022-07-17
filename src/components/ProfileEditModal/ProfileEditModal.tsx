import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./profile-edit-modal.module.css";

type Props = {
  showModal: boolean;
  setShowModal: () => void;
};

export const ProfileEditModal = ({ showModal, setShowModal }: Props) => {
  const domNode = useClickOutside(setShowModal);

  return (
    <div
      className={`${
        showModal
          ? `${styles.modalOverlay} ${styles.showModal}`
          : `${styles.modalOverlay}`
      }`}
    >
      <div ref={domNode} className={styles.modalContainer}>
        <form className={styles.btnContainer}>
          <button className="btn">Submit</button>

          <button
            className=" btn btn-outline"
            onClick={(e) => {
              e.preventDefault();
              setShowModal();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
