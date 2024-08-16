import { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Spinner";
import "./style.css";

interface InfiniteScrollComponentProps {
  heightProp?: string;
  children: React.ReactNode;
  targetId: string;
  loadFetchMoreData: () => void;
  currentCount: number;
  totalData: number;
}

const InfiniteScrollComponent: FC<InfiniteScrollComponentProps> = ({
  heightProp = "calc(100svh - 110px)",
  children,
  targetId,
  loadFetchMoreData,
  currentCount,
  totalData,
}) => {
  return (
    <InfiniteScroll
      dataLength={currentCount}
      next={loadFetchMoreData}
      hasMore={currentCount < totalData}
      loader={
        <div
          style={{
            color: "#717171",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // padding: "10px 0px",
            borderTop: "1px solid #0000000f",
            width: "100%",
          }}
        >
          <Spinner color="#FFF" />
        </div>
      }
      height={heightProp}
      scrollableTarget={targetId}
      inverse={false}
      className="infinite-movie-section"
    >
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollComponent;
