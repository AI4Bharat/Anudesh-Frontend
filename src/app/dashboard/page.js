'use client';
import { authenticateUser } from "@/utils/utils";
import MyOrganization from "../organizations/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/common/Header";

export default function Dashboard() {
    const router = useRouter();
    
    useEffect(() => {
        if (!authenticateUser()) {
          router.push('/login');
        }
      }, []);

    return(
        <>
            <Header/>
            <MyOrganization/>
        </>
    )
}