'use client';
import DetailsViewPage from "../workspace/DetailsViewPage";
import componentType from "../../config/PageType";
import { useSelector } from "react-redux";

const MyOrganization = () => {
    const organizationDetails = useSelector(state=>state.getLoggedInData?.data.organization);
    return (
        <DetailsViewPage
            title={organizationDetails && organizationDetails.title}
            createdBy={organizationDetails && organizationDetails.created_by && organizationDetails.created_by.username}
            pageType={componentType.Type_Organization}
        />
    )
}

export default MyOrganization;