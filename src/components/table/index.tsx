import  { useEffect, useState } from "react";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import "./index.css";

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const submissionsCollection = collection(db, "users");
      const submissionsSnapshot = await getDocs(submissionsCollection);
      const submissionsList = submissionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(submissionsList);
    };
    fetchUsers();
  }, []);

  const columns = [
    { field: "name", headerName: "Name", width: 150,flex:1 },
    { field: "email", headerName: "Email", width: 200 ,flex:1 },
    {
      field: "dob",
      headerName: "Dob",
      width: 150,
      flex:1 ,
      renderCell: (params:any) => {
        const timestamp = params.value; 
        // const date = timestamp.toDate();
        return moment().format("DD/MM/YYYY");
      }
    },
    // { field: "father_name", headerName: "Fathers Name", width: 200 },
    { field: "mobile", headerName: "Contact No.", width: 200,flex:1 , },
    { field: "address", headerName: "Permanent Address", width: 200 ,flex:1 ,},
    { field: "qualification", headerName: "Qualification", width: 200 ,flex:1 ,},
    {
      field: "image1Url",
      headerName: "Image 1",
      width: 150,
      flex:1 ,
      renderCell: (params: any) => (
        <img
          src={params.value}
          alt="User 1"
          width="50"
          style={{ borderRadius: "50%" }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }} className="table-container">
      <h2>User List</h2>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default UserTable;
