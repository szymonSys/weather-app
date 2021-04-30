import Search from "../../components/Search";
export default function MainContainerView({ children }) {
  return (
    <div>
      <Search />
      {children}
    </div>
  );
}
