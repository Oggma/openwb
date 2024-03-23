import Link from "next/link";
import { FunctionComponent } from "react";

interface HomeProps {
    
}
 
const Home: FunctionComponent<HomeProps> = () => {
    return (
      <div>
        <Link href={"/board"}>Open Board</Link>
      </div>
    );
}
 
export default Home;