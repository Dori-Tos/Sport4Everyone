import ProfilePage from "~/components/ProfilePage";
import { MainCentered } from "~/components/Main";
import { MainHeader } from "~/components/Header";
import Layout from "~/components/Layout";

export default function Profile() {

  return (
    <Layout protected={true}>
      <MainCentered>
        <MainHeader string="User Profile" />
        <ProfilePage />
      </MainCentered>
    </Layout>
  );
}
