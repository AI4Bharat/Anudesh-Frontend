'use client';
import DetailsViewPage from "../workspace/DetailsViewPage";
import componentType from "../../../../config/PageType";
import Spinner from "@/components/common/Spinner"
import React from "react";
import { useSelector } from "react-redux";

const MyOrganization = () => {
    const apiLoading = useSelector((state)=> state.getLoggedInData?.data.organization === undefined)
    const organizationDetails = useSelector(state=>state.getLoggedInData?.data.organization);
    return (
        <React.Fragment>
        {apiLoading ? <Spinner /> :
        <DetailsViewPage
            title={organizationDetails && organizationDetails.title}
            createdBy={organizationDetails && organizationDetails.created_by && organizationDetails.created_by.username}
            pageType={componentType.Type_Organization}
        />
        }
        </React.Fragment>
    )
}

export default MyOrganization;