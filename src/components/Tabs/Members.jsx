import React, { useState, useEffect } from "react";
<<<<<<< HEAD:src/components/Tabs/Members.jsx
// import {useDispatch,useSelector} from 'react-redux';
=======
import { Link, useNavigate, useParams } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
>>>>>>> efficiency:src/app/components/Tabs/Members.jsx
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
import { fetchOrganizationUsers } from "@/Lib/Features/getOrganizationUsers";
// import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";

const Members = () => {
    const dispatch = useDispatch();
    const orgId=1;
    const OrganizationUserData = useSelector(state=>state.getOrganizationUsers.data);

    const getOrganizationMembersData = ()=>{
        dispatch(fetchOrganizationUsers(orgId));
      }
      
      useEffect(()=>{
        getOrganizationMembersData();
      },[]);

      console.log("OrganizationUserData", OrganizationUserData)
    
    return(
        <MembersTable 
        dataSource = {OrganizationUserData}
          type="organization"
        />
    )
}

export default Members;