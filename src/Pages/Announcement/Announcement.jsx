import React, { useCallback, useEffect, useState } from "react";
import "./Announcement.scss";
import { Checkbox, DatePicker, Pagination, Table, Tag } from "antd";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import TextArea from "../../Common/Components/TextArea/TextArea";
import { HistoryOutlined } from "@ant-design/icons";
import CustomDatePicker from "../../Common/Components/CustomDatePicker/CustomDatePicker";
import { useGetAnnoucementMutation } from "../../Utility/Services/UserLoginAPI";
import { useGetUserListMutation } from "../../Utility/Services/UserListAPI";
import moment from "moment";
import { toast } from "react-toastify";
import _debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";

const menuPropsAsc = ["Ascending", "Descending"];

const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const toUppercase = (arr) => arr.map(capitalizeFirstLetter);

function Announcement() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [limit, setLimit] = useState(10); // Initial limit value
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [filter, setOrder] = useState("Descending");
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  const [isOpenAsc, setIsOpenAsc] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [userData, setUserData] = useState([]);
  const [errors, setErrors] = useState({});
  const [perpage, setPerpage] = useState()


const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); // Track the submit button state
const [loading, setLoading] = useState(false); // Track the loading state

const [getAnnoucement] = useGetAnnoucementMutation();
const [getUserList, { userList }] = useGetUserListMutation();

useEffect(() => {
  userListData();
}, [page, search, from_date, to_date, filter]);

useEffect(() => {
  // Enable the submit button if both title and details are filled
  setIsSubmitDisabled(!(title.trim() && details.trim()));
}, [title, details]);

  const debouncedSearch = useCallback(_debounce((e) => handleSearch(e.target.value), 1000), []);
  console.log(perpage, "yy---")
  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
    userListData();
  }, []);

  const handleInputChange = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };
  // console.log(perpage?.map((d) => console.log(d)), "iii")
  const userListData = async () => {
    let d = parseInt(perpage)
    console.log(d, "yyyy::6")
    let payload = { limit: 442, page: 1, search, from_date, to_date, filter }; // Fetch 100 users initially
    console.log(payload, "rrr")
    const { data } = await getUserList(payload);
    if (data) {
      setPerpage(data?.meta?.total, "test111::")
      setUserData(data.data); // Assuming data.data contains the user list
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setLoading(true); // Set loading state to true

    try {
      let newErrors = {};

      newErrors.title = !title ? "Title is Required" : "";
      newErrors.details = !details ? "Message is Required" : "";
      setErrors(newErrors);

      if (Object.values(newErrors).some((error) => error)) {
setLoading(false); // Reset loading state

        return;
      }

      const userIds = selectedUsers.map(user => user.key);
      await getAnnoucement({ title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(), details: details.charAt(0).toUpperCase() + details.slice(1).toLowerCase(), user_ids: userIds }).unwrap();
      toast.success("Announcement Added successfully");
      setDetails("");
      setTitle("");
      setSelectionType("");
      setSelectedUsers([])
      setPage(1);
      setSelectAll(false); // Resetting selectAll state
    } catch (error) {
      console.log(error);
setLoading(false);
      toast.error("Something Went Wrong" || error?.message);
    }
  };

  const handleOrderFilter = (filter) => {
    setOrder(filter);
    setPage(1);
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "SNo",
      render: (text, record, index) => <a>{calculateSerialNumber(index)}</a>,
    },
    {
      title: "Wallet Name",
      dataIndex: "WalletName",
    },
    {
      title: "MultichainPortfolio",
      dataIndex: "MultichainPortfolio",
    },
    {
      title: "Date",
      dataIndex: "Date",
    },
  ];

  function calculateSerialNumber(index) {
    return index + 1 + (page - 1) * limit;
  }

  const data1 = userData.map((userData, index) => {
    const { user_id, wallet_name, total_user_balance, created_at } = userData;
    return {
      key: user_id,
      SNo: (
        <div className="tableUserProfile">
          <p>{calculateSerialNumber(index)}</p>
        </div>
      ),
      WalletName: wallet_name,
      MultichainPortfolio: `$ ${total_user_balance}`,
      Date: moment(created_at).format("DD/MM/YYYY hh:mm A"),
    };
  });

  const handleFromDateChange = (date) => {
    setFromDate(date ? date.format("YYYY-MM-DD") : "");
    setPage(1);
  };

  const handleToDateChange = (date) => {
    setToDate(date ? date.format("YYYY-MM-DD") : "");
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setOrder("Descending");
    setPage(1);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const rowSelection = {
    selectedRowKeys: selectedUsers.map((user) => user.key),
    getCheckboxProps: (record) => ({
          disabled: selectAll, // Disable checkbox if "Select All" is checked
        }),
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length <= 100) {
        setSelectedUsers(selectedRows);
        setSelectAll(selectedRows.length === data1.length);
      } else {
        toast.error("You can select up to 100 users only.");
      }
    },
  };

const handleSelectAllChange = async (e) => {
  const checked = e.target.checked;
  setSelectAll(checked);
  // setSelectAllUsers(checked);
  // setSelectedUserKeys(new Set());
  // setSelectedUsers([]);
  // setSelectedUsersPerPage({});


  if (checked) {
    // If "Select All" is checked, clear any individual selections
    toast.info("All users are selected.");
  }
}

  const navigate = useNavigate();

  return (
    <div className="announcement">
      <div className="announcement_top commonCardBg">
        <InputCustom
          regularInput
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          maxLength={100}
          error={errors.title}
        />
        <TextArea
          placeholder="Message"
          onChange={(e) => setDetails(e.target.value)}
          value={details}
          maxLength={500}
          error={errors.details}
        />
        <ButtonCustom
          label="Send Message"
          regularBtn
          className={`announcement_top_sendBtn ${isSubmitDisabled || loading ? "disabled" : ""}`}
          onClick = { handleSubmit }
          disabled = { isSubmitDisabled || loading}
        />
      </div>
      <div className="commonCardBg">
        <div className="announcement_filters">
          <div className="announcement_filters_left">
            <InputCustom
              searchInputs
              placeholder="Search by Message"
              onChange={handleInputChange}
              value={search}
            />
            <CustomDatePicker
              picker="date"
              placeholder="From Date"
              value={from_date !== "" ? moment(from_date) : ""}
              onChange={handleFromDateChange}
              to_date={to_date}
            />
            <CustomDatePicker
              picker="date"
              placeholder="To Date"
              value={to_date !== "" ? moment(to_date) : ""}
              onChange={handleToDateChange}
              from_date={moment(from_date, "YYYY-MM-DD")}
            />
          </div>
          <div className="announcement_filters_right">
            <DropdownCustom
              buttonText="Ascending"
              menuItems={menuPropsAsc}
              className="action"
              handleMenuClick={handleOrderFilter}
              isOpen={isOpenAsc}
              setIsOpen={setIsOpenAsc}
              value={filter}
            />
            <ButtonCustom
              label="Reset"
              regularBtn
              onClick={handleResetFilters}
            />
          </div>
        </div>
        <div className="announcement_tablehistory">
          <Checkbox onChange={handleSelectAllChange} checked={selectAll}>
            Select All (Note: Manually you can select maximum 100 users at one time!)
          </Checkbox>
          <p onClick={() => navigate("/history/")}>
            <HistoryOutlined /> History
          </p>
        </div>
        {userData && <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data1}
          pagination={{
            current: page,
            pageSize: userList?.meta?.perPage,
            total: userList?.meta?.total,
            onChange: (page) => {
              setPage(page);
              userListData();
            },
            showSizeChanger: false,
          }}
        />}
      </div>
    </div>
  );
}

export default Announcement;








// import React, { useCallback, useEffect, useState } from "react";
// import "./Announcement.scss";
// import { Checkbox, Pagination, Table } from "antd";
// import InputCustom from "../../Common/Components/InputCustom/InputCustom";
// import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
// import TextArea from "../../Common/Components/TextArea/TextArea";
// import { HistoryOutlined } from "@ant-design/icons";
// import CustomDatePicker from "../../Common/Components/CustomDatePicker/CustomDatePicker";
// import { useGetAnnoucementMutation } from "../../Utility/Services/UserLoginAPI";
// import { useGetUserListMutation } from "../../Utility/Services/UserListAPI";
// import moment from "moment";
// import { toast } from "react-toastify";
// import _debounce from "lodash/debounce";
// import { useNavigate } from "react-router-dom";
// import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";

// const menuPropsAsc = ["Ascending", "Descending"];

// const capitalizeFirstLetter = (str) => {
//   if (!str) return str;
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

// const toUppercase = (arr) => arr.map(capitalizeFirstLetter);

// function Announcement() {
//   const [selectionType, setSelectionType] = useState("checkbox");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedUserKeys, setSelectedUserKeys] = useState(new Set()); // Track selected user keys globally
//   const [selectedUsersPerPage, setSelectedUsersPerPage] = useState({}); // Track selected users on each page
//   const [selectAllUsers, setSelectAllUsers] = useState(false); // Track if all users are selected globally
//   const [limit, setLimit] = useState(10); // Initial limit value
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [details, setDetails] = useState("");
//   const [title, setTitle] = useState("");
//   const [filter, setOrder] = useState("Descending");
//   const [from_date, setFromDate] = useState("");
//   const [to_date, setToDate] = useState("");
//   const [isOpenAsc, setIsOpenAsc] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [userData, setUserData] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [perpage, setPerpage] = useState([]);
//   const [isChecked, setIsChecked] = useState(true); // Initially, all selections are checked
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); // Track the submit button state
//   const [loading, setLoading] = useState(false); // Track the loading state

//   const [getAnnoucement] = useGetAnnoucementMutation();
//   const [getUserList, { userList }] = useGetUserListMutation();

//   useEffect(() => {
//     userListData();
//   }, [page, search, from_date, to_date, filter]);

//   useEffect(() => {
//     // Enable the submit button if both title and details are filled
//     setIsSubmitDisabled(!(title.trim() && details.trim()));
//   }, [title, details]);

//   const debouncedSearch = useCallback(
//     _debounce((e) => handleSearch(e.target.value), 1000),
//     []
//   );

//   const handleSearch = useCallback((value) => {
//     setSearch(value);
//     setPage(1);
//     userListData();
//   }, []);

//   const handleInputChange = (value) => {
//     setSearch(value);
//     debouncedSearch(value);
//   };

//   const userListData = async () => {
//     let payload = { limit, page, search, from_date, to_date, filter };
//     const { data } = await getUserList(payload);
//     if (data) {
//       setPerpage(data?.meta);
//       setUserData(data.data);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Set loading state to true

//     try {
//       let newErrors = {};

//       newErrors.title = !title ? "Title is Required" : "";
//       newErrors.details = !details ? "Message is Required" : "";
//       setErrors(newErrors);

//       if (Object.values(newErrors).some((error) => error)) {
//         setLoading(false); // Reset loading state
//         return;
//       }

//       const userIds = selectAllUsers ? [] : Array.from(selectedUserKeys);
//       if (userIds.length > 100) {
//         setIsChecked(false);
//         toast.error(userIds.length);
//       }
//       let res = await getAnnoucement({
//         title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
//         details: details.charAt(0).toUpperCase() + details.slice(1).toLowerCase(),
//         user_ids: userIds,
//       }).unwrap();
//       toast.success(res?.data);
//       setDetails("");
//       setTitle("");
//       setSelectionType("");
//       setSelectedUsers([]);
//       setSelectedUserKeys(new Set()); // Reset global selection
//       setSelectedUsersPerPage({}); // Reset selected users on each page
//       setSelectAllUsers(false); // Reset select all state
//       setPage(1);
//       setSelectAll(false); // Resetting selectAll state
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.message);
//       setLoading(false); // Reset loading state

//     }
//   };

//   const handleOrderFilter = (filter) => {
//     setOrder(filter);
//     setPage(1);
//   };

//   const columns = [
//     {
//       title: "S.No",
//       dataIndex: "SNo",
//       render: (text, record, index) => <a>{calculateSerialNumber(index)}</a>,
//     },
//     {
//       title: "Wallet Name",
//       dataIndex: "WalletName",
//     },
//     {
//       title: "MultichainPortfolio",
//       dataIndex: "MultichainPortfolio",
//     },
//     {
//       title: "Date",
//       dataIndex: "Date",
//     },
//   ];

//   function calculateSerialNumber(index) {
//     return index + 1 + (page - 1) * limit;
//   }

//   const data1 = userData.map((userData, index) => {
//     const { user_id, wallet_name, total_user_balance, created_at } = userData;
//     return {
//       key: user_id,
//       SNo: (
//         <div className="tableUserProfile">
//           <p>{calculateSerialNumber(index)}</p>
//         </div>
//       ),
//       WalletName: wallet_name,
//       MultichainPortfolio: `$ ${total_user_balance}`,
//       Date: moment(created_at).format("DD/MM/YYYY hh:mm A"),
//     };
//   });

//   const handleFromDateChange = (date) => {
//     setFromDate(date ? date.format("YYYY-MM-DD") : "");
//     setPage(1);
//   };

//   const handleToDateChange = (date) => {
//     setToDate(date ? date.format("YYYY-MM-DD") : "");
//     setPage(1);
//   };

//   const handleResetFilters = () => {
//     setSearch("");
//     setFromDate("");
//     setToDate("");
//     setOrder("Descending");
//     setPage(1);
//     setSelectedUsers([]);
//     setSelectedUserKeys(new Set());
//     setSelectedUsersPerPage({});
//     setSelectAll(false);
//     setSelectAllUsers(false); // Reset select all state
//   };

//   const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
//     let newSelectedUsersPerPage = { ...selectedUsersPerPage, [page]: selectedRowKeys };
//     setSelectedUsersPerPage(newSelectedUsersPerPage);

//     console.log(newSelectedUsersPerPage, "ddd::", selectedRowKeys)
//     // Combine selected keys from all pages
//     let allSelectedUserKeys = new Set();
//     Object.values(newSelectedUsersPerPage).forEach((keys) => {
//       keys.forEach((key) => allSelectedUserKeys.add(key));
//     });

//     setSelectedUserKeys(allSelectedUserKeys);
//     setSelectedUsers(selectedRows);

//     // Check if the selected rows exceed the limit
//     if (allSelectedUserKeys.size > 100) {
//       setIsChecked(false);
//       toast.error("Maximum 100 users can be selected.");
//     } else {
//       setIsChecked(true);
//     }
//   };

//   const rowSelection = {
//     selectedRowKeys: selectedUsersPerPage[page] || [],
//     onChange: handleRowSelectionChange,
//     getCheckboxProps: (record) => ({
//       disabled: selectAll, // Disable checkbox if "Select All" is checked
//     }),
//   };

//   const handleSelectAllChange = async (e) => {
//     const checked = e.target.checked;
//     setSelectAll(checked);
//     setSelectAllUsers(checked);
//     setSelectedUserKeys(new Set());
//     setSelectedUsers([]);
//     setSelectedUsersPerPage({});


//     if (checked) {
//       // If "Select All" is checked, clear any individual selections
//       toast.info("All users are selected.");
//     }
//   }
//   const navigate = useNavigate();

//   return (
//     <div className="announcement">
//       <div className="announcement_top commonCardBg">
//         <InputCustom
//           regularInput
//           placeholder="Title"
//           onChange={(e) => setTitle(e.target.value)}
//           value={title}
//           maxLength={100}
//           error={errors.title}
//         />
//         <TextArea
//           placeholder="Message"
//           onChange={(e) => setDetails(e.target.value)}
//           value={details}
//           maxLength={500}
//           error={errors.details}
//         />
//         <ButtonCustom
//           label="Send Message"
//           regularBtn
//           // className="announcement_top_sendBtn"
//           className={`announcement_top_sendBtn ${isSubmitDisabled || loading ? "disabled" : ""}`}
//           onClick={handleSubmit}
//           disabled={isSubmitDisabled || loading}
//         />
//       </div>
//       <div className="commonCardBg">
//         <div className="announcement_filters">
//           <div className="announcement_filters_left">
//             <InputCustom
//               searchInputs
//               placeholder="Search by Wallet Name"
//               onChange={handleInputChange}
//               value={search}
//             />
//             <CustomDatePicker
//               picker="date"
//               placeholder="From Date"
//               value={from_date !== "" ? moment(from_date) : ""}
//               onChange={handleFromDateChange}
//               to_date={to_date}
//             />
//             <CustomDatePicker
//               picker="date"
//               placeholder="To Date"
//               value={to_date !== "" ? moment(to_date) : ""}
//               onChange={handleToDateChange}
//               from_date={moment(from_date, "YYYY-MM-DD")}
//             />
//           </div>
//           <div className="announcement_filters_right">
//             <DropdownCustom
//               buttonText="Ascending"
//               menuItems={menuPropsAsc}
//               className="action"
//               handleMenuClick={handleOrderFilter}
//               isOpen={isOpenAsc}
//               setIsOpen={setIsOpenAsc}
//               value={filter}
//             />
//             <ButtonCustom
//               label="Reset"
//               regularBtn
//               onClick={handleResetFilters}
//             />
//           </div>
//         </div>
//         <div className="announcement_tablehistory">
//           <Checkbox onChange={handleSelectAllChange} checked={selectAll}>
//             Select All  (Note: Manually you can select maximum 100 users at one
//             time)
//           </Checkbox>
//           <p onClick={() => navigate("/history/")}>
//             <HistoryOutlined /> History
//           </p>
//         </div>
//         <Table
//           rowSelection={{
//             type: selectionType,
//             ...rowSelection,
//           }}
//           columns={columns}
//           dataSource={data1}
//           pagination={false}
//         />
//         {data1 && <Pagination
//           current={page}
//           pageSize={limit}
//           total={perpage?.total}
//           onChange={(page) => {
//             setPage(page);
//             userListData();
//           }}
//           showSizeChanger={false}
//         />}
//       </div>
//     </div>
//   );
// }

// export default Announcement;
