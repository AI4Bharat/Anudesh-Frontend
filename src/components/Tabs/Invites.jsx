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
import GetManagerSuggestionsAPI from "@/app/actions/api/user/GetManagerSuggestions";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { FormControl } from "@mui/material";

const Invites = (props) => {
    const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
    const {hideButton,reSendButton} = props;
    const dispatch = useDispatch();
    // const { orgId } = useParams();
    const orgId = useParams()
    const OrganizationUserData = useSelector(state => state.getOrganizationUsers.data);
    const apiLoading = useSelector((state) => state.getOrganizationUsers.status !== "succeeded");
    const ManagerSuggestions = useSelector(state => state.getManagerSuggestions.data);
    const [tabValue, setTabValue] = useState(0);
    const getOrganizationMembersData = () => {
        dispatch(fetchOrganizationUsers(orgId));
    }
/* eslint-disable react-hooks/exhaustive-deps */
    const getManagerSuggestions = () => {
        const managerSuggestionsObj = new GetManagerSuggestionsAPI(orgId);
        dispatch(APITransport(managerSuggestionsObj));
    }
    const handleTabChange = (e, v) => {
        setTabValue(v);
    }
    useEffect(() => {
        getManagerSuggestions();
        getOrganizationMembersData();
    }, []);
    
    return (
        <React.Fragment>
        <FormControl>
              <Box sx={{mb:2,}} >

            {userDetails && userDetails.role === 6 &&  
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Invited Users" sx={{ fontSize: 17, fontWeight: '700' }} />
                    <Tab label="Manager Suggestions" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                </Tabs>
            }
            </Box> 
        </FormControl>

        {tabValue === 0 ?
            <MembersTable
            key={1}
            reSendButton ={reSendButton}
            hideButton = {hideButton ? hideButton : false}
            dataSource={OrganizationUserData && OrganizationUserData.length > 0 && OrganizationUserData.filter((el, i) => { return !el.has_accepted_invite })}
            />
            : <>
            <MembersTable
            key={2}
            hideViewButton={true}
            showInvitedBy={true}
            hideButton = {hideButton ? hideButton : false}
            approveButton = {true}
            rejectButton = {true}
            dataSource={ManagerSuggestions && ManagerSuggestions.length > 0 && ManagerSuggestions.filter((el, i) => { return !el.has_accepted_invite })}
            />
            </>
        }

        </React.Fragment>
    )
}

export default Invites;