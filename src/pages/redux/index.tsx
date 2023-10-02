import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  decrement,
  decrementByAmount,
  fetchContent,
  increment,
  incrementByAmount,
} from "@/store/slices/counterSlice";
import { Button } from "@mui/material";
import React from "react";

const ReduxConcepts = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>{count}</h1>
      <Button variant="contained" onClick={() => dispatch(increment())}>
        +
      </Button>
      <Button variant="contained" onClick={() => dispatch(decrement())}>
        -
      </Button>
      <Button
        variant="contained"
        onClick={() => dispatch(incrementByAmount(10))}
      >
        +
      </Button>
      <Button
        variant="contained"
        onClick={() => dispatch(decrementByAmount(10))}
      >
        -
      </Button>
      <Button variant="contained" onClick={() => dispatch(fetchContent())}>
        Fetch Data
      </Button>
    </div>
  );
};

export default ReduxConcepts;
