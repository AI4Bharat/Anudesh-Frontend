// Invites

import { fetchOrganizationUsers } from "@/Lib/Features/getOrganizationUsers";
import React, { useState, useEffect } from "react";
<<<<<<< HEAD:src/components/Tabs/Invites.jsx
// import { useDispatch, useSelector } from 'react-redux';
=======
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
>>>>>>> efficiency:src/app/components/Tabs/Invites.jsx
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
// import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";

const Invites = (props) => {
    const {hideButton,reSendButton} = props;
    const dispatch = useDispatch();
    // const { orgId } = useParams();
    const orgId =1;
    const OrganizationUserData = useSelector(state => state.getOrganizationUsers.data);

    const getOrganizationMembersData = () => {
        dispatch(fetchOrganizationUsers(orgId));
    }

    useEffect(() => {
        getOrganizationMembersData();
    }, []);
    
    return (
        <MembersTable
            reSendButton ={reSendButton}
            hideButton = {hideButton ? hideButton : false}
            dataSource={OrganizationUserData && OrganizationUserData.length > 0 && OrganizationUserData.filter((el, i) => { return !el.has_accepted_invite })}
        />
    )
}

export default Invites;