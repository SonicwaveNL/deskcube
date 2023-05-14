import dynamic from "next/dynamic";

const DynamicTopbar = dynamic(() => import('../Topbar/topbar'), {
    ssr: false
});

export default DynamicTopbar;