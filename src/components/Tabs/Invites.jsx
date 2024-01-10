// Invites

import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
// import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";

const Invites = (props) => {
    const {hideButton,reSendButton} = props;
    // const dispatch = useDispatch();
    // const { orgId } = useParams();
    // const OrganizationUserData = useSelector(state => state.getOrganizationUsers.data);

    // const getOrganizationMembersData = () => {
    //     const organizationUsersObj = new GetOragnizationUsersAPI(orgId);
    //     dispatch(APITransport(organizationUsersObj));
    // }

    // useEffect(() => {
    //     getOrganizationMembersData();
    // }, []);
    const dataSource= [
        {
            "id": 94,
            "username": "drrsuresha",
            "email": "drrsuresha@gmail.com",
            "first_name": "Dr. Suresha",
            "last_name": "R",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 151,
            "username": "Pramodini Pradhan",
            "email": "pramodinip@gmail.com",
            "first_name": "Pramodini",
            "last_name": "Pradhan",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 72,
            "username": "Srija",
            "email": "srmukh@gmail.com",
            "first_name": "Srija",
            "last_name": "Mukherjee",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 100,
            "username": "Devanga",
            "email": "debangapallav4u@gmail.com",
            "first_name": "Devanga Pallav",
            "last_name": "Saikia",
            "role": 4,
            "has_accepted_invite": true
        },
        {
            "id": 203,
            "username": "saee",
            "email": "saeekodolikar@gmail.com",
            "first_name": "Saee",
            "last_name": "Kodolikar",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 319,
            "username": "AG Datta",
            "email": "translatortel2@gmail.com",
            "first_name": "",
            "last_name": "",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 396,
            "username": "NDM",
            "email": "narayanduttmishra@ai4bharat.org",
            "first_name": "",
            "last_name": "",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 356,
            "username": "Shivakumar Mavali",
            "email": "mavalihere@gmail.com",
            "first_name": "Shivakumar",
            "last_name": "Mavali",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 2090,
            "username": "Shakeel Ahmad",
            "email": "shakeel.ahmad@rekhta.org",
            "first_name": "",
            "last_name": "",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 316,
            "username": "Translator Gujarati - LSB",
            "email": "translatorguj1@gmail.com",
            "first_name": "",
            "last_name": "",
            "role": 2,
            "has_accepted_invite": true
        },
        {
            "id": 139,
            "username": "Vrinda",
            "email": "vrinda0606@gmail.com",
            "first_name": "VRINDA",
            "last_name": "SARKAR",
            "role": 3,
            "has_accepted_invite": true
        },
        {
            "id": 375,
            "username": "Naresh Kapadia",
            "email": "nareshkkapadia@gmail.com",
            "first_name": "Naresh",
            "last_name": "Kapadia",
            "role": 3,
            "has_accepted_invite": true
        },
        {
            "id": 339,
            "username": "Karuna Vempati",
            "email": "karunajk@gmail.com",
            "first_name": "Karuna",
            "last_name": "Vempati",
            "role": 3,
            "has_accepted_invite": true
        },
        {
            "id": 218,
            "username": "JayaSaraswati",
            "email": "jaya.saraswati@gmail.com",
            "first_name": "Jaya",
            "last_name": "Saraswati",
            "role": 4,
            "has_accepted_invite": true
        }]
    return (
        <MembersTable
            reSendButton ={reSendButton}
            hideButton = {hideButton ? hideButton : false}
            dataSource={dataSource}
        />
    )
}

export default Invites;