'use client';
import DetailsViewPage from "../workspace/DetailsViewPage";
import componentType from "../../config/PageType";
// import { useSelector } from "react-redux";

const MyOrganization = () => {
    return (
        <DetailsViewPage
            pageType={componentType.Type_Organization}
        />
    )
}

export default MyOrganization;