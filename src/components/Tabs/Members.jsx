import React, { useState, useEffect } from "react";
// import {useDispatch,useSelector} from 'react-redux';
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
// import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";

const Members = () => {
    // const dispatch = useDispatch();
    // const {orgId} = useParams();
    // const OrganizationUserData = useSelector(state=>state.getOrganizationUsers.data);

    // const getOrganizationMembersData = ()=>{
    //     const organizationUsersObj = new GetOragnizationUsersAPI(orgId);
    //     dispatch(APITransport(organizationUsersObj));
    //   }
      
    //   useEffect(()=>{
    //     getOrganizationMembersData();
    //   },[]);

    //   console.log("OrganizationUserData", OrganizationUserData)
    
    return(
        <MembersTable 
          type="organization"
        />
    )
}

export default Members;