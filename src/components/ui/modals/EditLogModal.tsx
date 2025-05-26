import React, { useEffect, useMemo, useState } from "react";
import ReadOnlyTablePage from "../tables/ReadOnlyTable";

export interface EditModalPageProps {
  userId: number;
  onClose: () => void;
}

const EditModalPage: React.FC<EditModalPageProps> = ({ userId, onClose }) => {

  return (
    <ReadOnlyTablePage
      data={}
      columns={}
    />
  );
};

export default EditModalPage;
