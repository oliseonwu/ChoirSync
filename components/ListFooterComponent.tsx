import { View } from "react-native";
import React, { memo } from "react";
import { Button } from "react-native-paper";

type ListFooterComponentProps = {
  isLoading: boolean;
};

const ListFooterComponent = ({ isLoading }: ListFooterComponentProps) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View>
      <Button disabled loading>
        Fetching more...
      </Button>
    </View>
  );
};

export default memo(ListFooterComponent, (prevProps, nextProps) => {
  return prevProps.isLoading === nextProps.isLoading;
});
