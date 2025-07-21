import React, { useState, useEffect } from "react";
import { timeAgo } from "../helpers/timeAgo";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineDotsVertical } from "./icons";
import { Like, DeleteConfirmation, Edit } from "./index";
import {
  deleteAComment,
  editAComment,
  getVideoComments,
} from "../store/Slices/commentSlice";

const CommentsList = ({
  avatar,
  username,
  createdAt,
  content,
  commentId,
  
  videoId,
}) => {
  const dispatch = useDispatch();
  const comment = useSelector((state) =>
    state.comment.comments.find((c) => c._id === commentId)
  );
  const avatar2 = useSelector((state) => state.auth?.userData?.avatar.url);
  const authUsername = useSelector((state) => state.auth?.userData?.username);

  const [editState, setEditState] = useState({
    editing: false,
    editedContent: content,
    isOpen: false,
    delete: false,
  });
  const handleEditComment = (updatedContent) => {
    console.log("upd", updatedContent);
    dispatch(editAComment({ commentId, updatedContent }));
    // .then(() => {
    //   dispatch(getVideoComments({ videoId, page: 1 })); // <- Refetch after edit
    // });

    setEditState((prevState) => ({
      ...prevState,
      editing: false,
      updatedContent,
      isOpen: false,
      delete: false,
    }));
  };

  const handleDeleteComment = () => {
    dispatch(deleteAComment(commentId)).then(() => {
      dispatch(getVideoComments({ videoId, page: 1 })); // <- Refetch after delete
    });
    setEditState((prevState) => ({
      ...prevState,
      delete: false,
    }));
  };
  useEffect(() => {
  if (comment) {
    setEditState((prevState) => ({
      ...prevState,
      editedContent: comment.content,
    }));
  }
}, [comment?.content]);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoComments({ videoId, page: 1 }));
    }
  }, [dispatch, videoId]);
  return (
    <>
      <div className="text-white w-full ml-20 mb-5 flex justify-start items-center sm:gap-5 gap-3 border-b border-slate-600 p-3 sm:p-5">
        <div className="w-12">
          <img
            src={avatar || avatar2}
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>
        <div className="w-full flex flex-col gap-1 relative">
          <div className="flex items-center gap-2">
            <h2 className="text-xs">{username || authUsername}</h2>
            <span className="text-xs text-slate-400">{timeAgo(createdAt)}</span>
          </div>

          {/*dropdown for edit and delete comment */}
          {authUsername === username && (
            <div className="absolute right-0">
              <div className="relative">
                <HiOutlineDotsVertical
                  className="text-white cursor-pointer"
                  onClick={() =>
                    setEditState((prevState) => ({
                      ...prevState,
                      isOpen: !prevState.isOpen,
                    }))
                  }
                />

                {editState.isOpen && (
                  <div className="border bg-[#222222] text-lg border-slate-600 absolute text-center right-2 rounded-xl">
                    <ul>
                      <li
                        className="hover:opacity-50 px-5 cursor-pointer border-b border-slate-600"
                        onClick={() =>
                          setEditState((prevState) => ({
                            ...prevState,
                            editing: !prevState.editing,
                            isOpen: false,
                          }))
                        }
                      >
                        Edit
                      </li>
                      <li
                        className="px-5 hover:opacity-50 cursor-pointer"
                        onClick={() =>
                          setEditState((prevState) => ({
                            ...prevState,
                            delete: true,
                            isOpen: false,
                          }))
                        }
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirm popup */}
          {editState.delete && (
            <DeleteConfirmation
              onCancel={() =>
                setEditState((prevState) => ({
                  ...prevState,
                  delete: false,
                  isOpen: false,
                }))
              }
              onDelete={handleDeleteComment}
              comment={true}
            />
          )}

          {/* edit comment */}
          {editState.editing ? (
            <Edit
              initialContent={editState.editedContent}
              onCancel={() =>
                setEditState((prevState) => ({
                  ...prevState,
                  editing: false,
                  isOpen: false,
                }))
              }
              onSave={handleEditComment}
            />
          ) : (
            editState.editedContent
          )}

          {/* Like for comments */}
          <Like
            isLiked={comment?.isLiked}
            likesCount={comment?.likesCount}
            commentId={commentId}
            size={17}
          />
        </div>
      </div>
    </>
  );
};

export default CommentsList;
