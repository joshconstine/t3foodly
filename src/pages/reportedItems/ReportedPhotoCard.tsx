import { ReportedPhoto } from "@prisma/client";

import Image from "next/image";
import { api } from "../../utils/api";

interface IReportedPhotoCardProps {
  reportedPhoto: ReportedPhoto;
}
const ReportedPhotoCard = (props: IReportedPhotoCardProps) => {
  const { reportedPhoto } = props;

  const photo = api.photo.getById.useQuery({ id: reportedPhoto?.photo_id });
  const deleteReportedPhoto = api.reportedPhoto.delete.useMutation();
  const deletePhoto = api.photo.delete.useMutation();
  const handleRemovePhoto = () => {
    deletePhoto.mutate(
      {
        id: reportedPhoto?.photo_id,
      },
      {
        onSuccess() {
          deleteReportedPhoto.mutate(
            {
              id: reportedPhoto?.photo_id,
            },
            {
              onSuccess() {},
            }
          );
        },
      }
    );
  };
  return (
    <div>
      <button
        className="rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
        onClick={handleRemovePhoto}
      >
        remove photo
      </button>
      {reportedPhoto?.id}
      {photo.data?.photoUrl && (
        <Image
          src={photo?.data?.photoUrl}
          alt={"img"}
          width={200}
          height={200}
        />
      )}
    </div>
  );
};

export default ReportedPhotoCard;
