import { useEffect, useRef, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./profile-edit-modal.module.css";
import { MdOutlineFileUpload } from "react-icons/md";
import { updateProfileDetails } from "../../features/authSlice";

type Props = {
  showModal: boolean;
  setShowModal: () => void;
};

export const ProfileEditModal = ({ showModal, setShowModal }: Props) => {
  const domNode = useClickOutside(setShowModal);
  const { userDetails, allUsers } = useAppSelector((store) => store?.auth);
  const dispatch = useAppDispatch();

  const [profileDetails, setProfileDetails] = useState({
    displayName: "",
    userName: "",
    portfolioLink: "",
    bio: "",
  });

  const [errMsg, setErrMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const filePickerRef = useRef<any>(null);

  useEffect(() => {
    setProfileDetails({
      displayName: userDetails!.displayName,
      userName: userDetails!.userName,
      portfolioLink: userDetails!.portfolioLink,
      bio: userDetails!.bio,
    });
  }, [userDetails, showModal]);

  useEffect(() => {
    setErrMsg("");
  }, [profileDetails.userName]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (
      profileDetails.userName &&
      profileDetails.userName !== userDetails?.userName
    ) {
      timeout = setTimeout(() => {
        const userExists = allUsers.some((user) => {
          return (
            user.userName.toLowerCase() ===
            profileDetails?.userName.toLowerCase()
          );
        });
        if (userExists) {
          setErrMsg("User already Exists");
        }
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [allUsers, profileDetails.userName, userDetails?.userName]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const imageChangeHandler = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target!.result!.toString());
    };
  };

  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch(
      updateProfileDetails({
        displayName: profileDetails.displayName,
        userName: profileDetails.userName,
        portfolioLink: profileDetails.portfolioLink,
        bio: profileDetails.bio,
        photo: selectedFile,
      })
    );
    setShowModal();
  };
  return (
    <div
      className={`${
        showModal
          ? `${styles.modalOverlay} ${styles.showModal}`
          : `${styles.modalOverlay}`
      }`}
    >
      <div ref={domNode} className={styles.modalContainer}>
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.imgContainer}>
            {selectedFile ? (
              <img
                className={`avatar ${styles.profilePhoto}`}
                src={selectedFile}
                alt="profile"
              />
            ) : userDetails?.photo ? (
              <img
                className={`avatar ${styles.profilePhoto}`}
                src={userDetails?.photo}
                alt="gojo"
              />
            ) : (
              <BsPersonCircle className={styles.profilePhoto} />
            )}
            <MdOutlineFileUpload
              onClick={() => filePickerRef.current.click()}
              className={styles.uploadIcon}
            />
            <input
              onChange={imageChangeHandler}
              type="file"
              ref={filePickerRef}
              hidden
            />
          </div>
          <label htmlFor="displayName">Full Name</label>
          <input
            type="text"
            name="displayName"
            value={profileDetails.displayName}
            onChange={handleChange}
          />

          <p
            className={errMsg ? styles.errmsg : styles.offscreen}
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            name="userName"
            value={profileDetails.userName}
            onChange={handleChange}
          />

          <label htmlFor="portfolioLink">Portfolio Link</label>
          <input
            type="text"
            name="portfolioLink"
            value={profileDetails.portfolioLink}
            onChange={handleChange}
          />

          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            name="bio"
            onChange={handleChange}
            value={profileDetails.bio}
          />

          <div className={styles.btnContainer}>
            <button className="btn">Submit</button>

            <button
              className=" btn btn-outline"
              onClick={(e) => {
                e.preventDefault();
                setShowModal();
                setSelectedFile("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
