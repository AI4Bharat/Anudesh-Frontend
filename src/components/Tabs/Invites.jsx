// Invites

import { fetchOrganizationUsers } from "@/Lib/Features/getOrganizationUsers";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
// import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";
import Spinner from "@/components/common/Spinner"

const Invites = (props) => {
    const {hideButton,reSendButton} = props;
    const dispatch = useDispatch();
    // const { orgId } = useParams();
    const orgId =1;
    const OrganizationUserData = useSelector(state => state.getOrganizationUsers.data);
    const apiLoading = useSelector((state) => state.getOrganizationUsers.status !== "succeeded");
    const getOrganizationMembersData = () => {
        dispatch(fetchOrganizationUsers(orgId));
    }
/* eslint-disable react-hooks/exhaustive-deps */

    useEffect(() => {
        getOrganizationMembersData();
    }, []);
    
    return (
        <React.Fragment> 
        { apiLoading ? <Spinner /> : 
            <MembersTable
                reSendButton ={reSendButton}
                hideButton = {hideButton ? hideButton : false}
                dataSource={OrganizationUserData && OrganizationUserData.length > 0 && OrganizationUserData.filter((el, i) => { return !el.has_accepted_invite })}
            />
        }
        </React.Fragment>
    )
}

export default Invites;