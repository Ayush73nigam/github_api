import "./App.css";
import { useState, useMemo } from "react";
import {
  Avatar,
  Button,
  TextInput,
  TabNavigation,
  Tab,
  Table,
} from "evergreen-ui";

function App() {
  const [username, setUsername] = useState("");
  const [profile, setprofile] = useState({});

  const [followers, setfollower] = useState([]);
  const [repo, setrepo] = useState([]);

  const [loading, setLoading] = useState(false);

  const tabs = useMemo(() => ["Followers", "Repositories"], []);
  // State is only used here for demo purposes, your routing abstraction might support hash links
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.github.com/search/users?q=" + username
      );

      const data = await res?.json();
      setprofile(data?.items[0]);

      getFollowers(data?.items[0]);
      getRepo(data?.items[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getFollowers = async (profile) => {
    try {
      const res = await fetch(profile?.followers_url);
      const data = await res?.json();
      setfollower(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getRepo = async (profile) => {
    try {
      const res = await fetch(profile?.repos_url);
      const data = await res?.json();
      setrepo(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="App">
      <h1>Search Github Profile</h1>
      <TextInput
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        width={450}
        height={40}
      />

      <Button
        marginRight={5}
        marginLeft={3}
        appearance="primary"
        onClick={searchProfile}
        width={100}
        height={40}
        alignItems={"center"}
      >
        Search
      </Button>

      {profile?.login && (
        <div style={{ marginTop: 30 }}>
          <Avatar src={profile?.avatar_url} name={profile?.login} size={80} />
          <h3>{profile?.login}</h3>
          {/* {JSON.stringify(profile)} */}
          <TabNavigation>
            {tabs.map((tab, index) => {
              const id = tab.toLowerCase().replace(" ", "-");
              const hash = `#${id}`;
              return (
                <Tab
                  width={150}
                  height={35}
                  margin={10}
                  href={hash}
                  is="a"
                  isSelected={selectedIndex === index}
                  key={tab}
                  onClick={() => setSelectedIndex(index)}
                >
                  {tab}
                </Tab>
              );
            })}
          </TabNavigation>
          {selectedIndex === 0 && (
            <div className="follow">
              <h2>Followers</h2>

              <Table>
                <Table.Head>
                  <Table.SearchHeaderCell />
                  <Table.TextHeaderCell>Last Activity</Table.TextHeaderCell>
                  <Table.TextHeaderCell>ltv</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body height={"auto"}>
                  {followers?.map((p) => (
                    <Table.Row key={p.id}>
                      <Table.TextCell>
                        <Avatar src={p?.avatar_url} name={p?.login} size={40} />
                      </Table.TextCell>
                      <Table.TextCell>{p.login}</Table.TextCell>
                      <Table.TextCell>
                        <a href={"https://github.com/" + p?.login}>
                          Visit Profile
                        </a>
                      </Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}{" "}
          {selectedIndex === 1 && (
            <div className="repos">
              <h2>Repositories</h2>

              <Table width={800} style={{ margin: "0 auto" }}>
                <Table.Head>
                  <Table.TextHeaderCell>Avatar</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Username</Table.TextHeaderCell>
                  <Table.TextHeaderCell>View</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body height={"auto"}>
                  {repo?.map((p) => (
                    <Table.Row key={p.id}>
                      <Table.TextCell>{p?.name}</Table.TextCell>
                      <Table.TextCell>
                        {p?.description?.length ? p?.description : "N/A"}
                      </Table.TextCell>
                      <Table.TextCell>
                        <a href={p?.html_url}>View Repo</a>
                      </Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
