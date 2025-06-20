import React from "react";
import KioskMain from "./components/kiosk-main";
import KioskContent from "./components/kiosk-content";
import KioskBenefits from "./components/kiosk-benefits";
import KioskManufacturers from "./components/kiosk-manufacturers";
import KioskConsultancy from "./components/kiosk-consultancy";

function KioskPage() {
    return (
        <div className="flex flex-col relative">
            <KioskMain />
            <KioskContent />
            <KioskBenefits />
            <KioskManufacturers />
            <KioskConsultancy />
        </div>
    );
}

export default KioskPage;
