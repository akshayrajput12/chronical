import React from "react";
import KioskMain from "./components/kiosk-main";
import KioskContent from "./components/kiosk-content";
import KioskBenefits from "./components/kiosk-benefits";
import KioskManufacturers from "./components/kiosk-manufacturers";
import KioskConsultancy from "./components/kiosk-consultancy";
import BoothRequirementsForm from "../home/components/booth-requirements-form";

function KioskPage() {
    return (
        <div className="flex flex-col relative">
            <KioskMain />
            <KioskContent />
            <KioskBenefits />
            <KioskManufacturers />
            <BoothRequirementsForm />
        </div>
    );
}

export default KioskPage;
