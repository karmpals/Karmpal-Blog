import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashVideos() {
  const { currentUser } = useSelector((state) => state.user);
  const [userVideos, setUserVideos] = useState([]);
  const [showMore, SetShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`/api/video/getvideos?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserVideos(data.videos);
          if (data.length < 9) {
            SetShowMore(false);
          }
        }
      } catch (error) {}
    };
    if (currentUser.isAdmin) {
      fetchVideos();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userVideos.length;
    try {
      const res = await fetch(
        `/api/video/getvideos?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserVideos((prev) => [...prev, ...data.videos]);
        if (data.videos.length < 9) {
          SetShowMore(false);
        }
      }
    } catch (error) {}
  };

  const handleDeleteVideo = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/video/deletevideo/${videoIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = res.json();
      if (res.ok) {
        setUserVideos((prev) =>
          prev.filter((video) => video._id !== videoIdToDelete)
        );
      }
    } catch (error) {}
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userVideos.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Video title</Table.HeadCell>
              <Table.HeadCell>thumbnail</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userVideos.map((video) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(video.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-gray-900 font-medium dark:text-white"
                      to={`/video/${video.slug}`}
                    >
                      {video.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-gray-900 font-medium dark:text-white"
                      to={`/video/${video.slug}`}
                    >
                      <img src={video.image} className="w-20 h-10 rounded" alt="" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{video.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setVideoIdToDelete(video._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-video/${video._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
       ) : (
        <p>You have no videos yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this video?
            </h3>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleDeleteVideo}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
