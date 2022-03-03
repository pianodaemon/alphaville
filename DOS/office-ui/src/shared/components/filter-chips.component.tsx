import React, { useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useNonInitialEffect } from "src/shared/hooks/use-non-initial-effect.hook";

type Props = {
  initialAppliedFilters: any;
  filters: Array<Filter>;
  loadAction: Function;
};

type Filter = {
  abbr: string;
  type: "dropdown" | "text";
  param: string;
  name: string;
  options: Array<{ [key: string]: string }>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-start",
      flexDirection: "column",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    controls: {
      alignItems: "baseline",
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 170,
    },
  })
);

export const FilterChips = (props: Props) => {
  const { filters, initialAppliedFilters, loadAction } = props;
  const getInitFilters = (): Array<Partial<Filter>> => {
    return Object.keys(initialAppliedFilters).map((filter) => {
      const filt = filters.find((f) => f.param === filter);
      const { abbr, param, type } = filt || {};
      return {
        abbr,
        type,
        filter: param,
        value: initialAppliedFilters[filter],
      };
    });
  };
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<any>(null);
  const [appliedFilters, setAppliedFilters] = useState<Array<any>>([
    ...getInitFilters(),
  ]);
  const classes = useStyles();
  const applyFilter = () => {
    if (
      !filterValue.trim() ||
      appliedFilters.some(
        (f) =>
          f.abbr === filters[selectedFilter].abbr &&
          f.value.trim() === filterValue.trim()
      )
    ) {
      return false;
    }
    const filteredFilters =
      filters[selectedFilter].abbr === "ID"
        ? appliedFilters.filter(
            (item) => item.abbr !== filters[selectedFilter].abbr
          )
        : appliedFilters;
    setAppliedFilters([
      ...filteredFilters,
      {
        abbr: filters[selectedFilter].abbr,
        type: filters[selectedFilter].type,
        filter: filters[selectedFilter].param,
        value: filterValue.trim(),
      },
    ]);
  };
  const removeFilter = (index: number) => {
    const newFilters = [...appliedFilters];
    newFilters.splice(index, 1);
    setAppliedFilters([...newFilters]);
  };

  useNonInitialEffect(() => {
    const f = appliedFilters.reduce((acc: any, next: any) => {
      const filterValue = acc[next.filter]
        ? `${acc[next.filter]}||${next.value}`
        : next.value;
      return { ...acc, [next.filter]: filterValue };
    }, {});
    loadAction({
      page: 1,
      ...(Object.keys(f).length
        ? { ...f, filters: f }
        : { filters: {}, clearFilters: true }),
    });
  }, [appliedFilters, loadAction]);

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <FormControl className={classes.formControl}>
          <InputLabel id="filter-select-label">Filtros Disponibles</InputLabel>
          <Select
            labelId="filter-select-label"
            id="filter-select"
            value={selectedFilter || 0}
            onChange={(event: any) => {
              setFilterValue(null);
              setSelectedFilter(event.target.value);
            }}
          >
            {filters.map((filter: any, index: number) => (
              <MenuItem value={index} key={`${index + 1}`}>
                {filter.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {filters[selectedFilter].type === "text" && (
          <FormControl className={classes.formControl}>
            <TextField
              id="text_search"
              label="Texto a buscar (palabra completa)"
              value={filterValue || ""}
              onChange={(event: any) => setFilterValue(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
        )}

        {filters[selectedFilter].type === "dropdown" && (
          <FormControl className={classes.formControl}>
            <InputLabel id="filter-values-label">Valor Filtro</InputLabel>
            <Select
              labelId="filter-values-label"
              id="filter-values-select"
              value={filterValue || ""}
              onChange={(event: any) => setFilterValue(event.target.value)}
            >
              {filters &&
                filters[selectedFilter].options &&
                filters[selectedFilter].options.map(
                  (filter: any, index: number) => (
                    <MenuItem value={filter.id} key={`${index + 1}`}>
                      {filter.value}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormControl>
        )}

        <Button variant="contained" onClick={() => applyFilter()} type="submit">
          Aplicar filtro
        </Button>
      </div>

      <div>
        {appliedFilters.map((item: any, index: number) => (
          <Chip
            key={`${index + 1}`}
            avatar={<Avatar>{item.abbr}</Avatar>}
            label={`${
              item.type === "dropdown"
                ? filters
                    .find((f) => f.abbr === item.abbr)
                    ?.options.find((option: any) => option.id === item.value)
                    ?.value
                : item.value
            }`}
            onDelete={() => removeFilter(index)}
            color="secondary"
          />
        ))}
      </div>
    </div>
  );
};
