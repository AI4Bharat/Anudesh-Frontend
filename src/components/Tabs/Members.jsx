import React, { useState, useEffect } from "react";

import { Link, useNavigate, useParams } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
import { fetchOrganizationUsers } from "@/Lib/Features/getOrganizationUsers";
// import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";

const Members = () => {
   /* eslint-disable react-hooks/exhaustive-deps */

    const dispatch = useDispatch();
    const orgId=1;
    const OrganizationUserData = useSelector(state=>state.getOrganizationUsers.data);

    const getOrganizationMembersData = ()=>{
        dispatch(fetchOrganizationUsers(orgId));
      }
   /* eslint-disable react-hooks/exhaustive-deps */
   
      useEffect(()=>{
        getOrganizationMembersData();
      },[]);

    
    return(
        <MembersTable 
        dataSource = {OrganizationUserData}
        type="organization"
        />
    )
}

export default Members;