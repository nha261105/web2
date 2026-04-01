import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
};

type ChartTooltipPayloadItem = {
  dataKey?: string;
  name?: string;
  value?: number | string;
  color?: string;
  payload?: {
    fill?: string;
  };
};

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  const style = React.useMemo(() => {
    return Object.entries(config).reduce((acc, [key, value]) => {
      if (value?.color) {
        (acc as Record<string, string>)[`--color-${key}`] = value.color;
      }

      return acc;
    }, {} as React.CSSProperties);
  }, [config]);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        style={style}
        className={cn("w-full min-w-0 min-h-55", className)}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
        >
          {
            children as React.ComponentProps<
              typeof RechartsPrimitive.ResponsiveContainer
            >["children"]
          }
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent(props: {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string;
  className?: string;
  indicator?: "line" | "dot";
  hideLabel?: boolean;
  valueFormatter?: (value: number | string | undefined) => string;
  labelFormatter?: (label: string | undefined) => string;
}) {
  const {
    active,
    payload,
    label,
    className,
    indicator = "dot",
    hideLabel = false,
    valueFormatter,
    labelFormatter,
  } = props;

  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-36 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-xl",
        className,
      )}
    >
      {!hideLabel && label ? (
        <div className="mb-2 text-[11px] font-semibold text-gray-500">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      ) : null}

      <div className="space-y-1.5">
        {payload.map((item, index) => {
          const key = String(item.dataKey ?? item.name ?? index);
          const itemConfig = config[key];
          const itemLabel =
            (typeof itemConfig?.label === "string"
              ? itemConfig.label
              : item.name) ?? key;
          const color =
            item.color ||
            item.payload?.fill ||
            `var(--color-${key})` ||
            "#0052CC";

          return (
            <div
              key={`${key}-${index}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                {indicator === "line" ? (
                  <span
                    className="h-0.5 w-3 rounded"
                    style={{ backgroundColor: color }}
                  />
                ) : (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="text-gray-600">{itemLabel}</span>
              </div>
              <span className="font-semibold text-gray-900">
                {valueFormatter
                  ? valueFormatter(item.value)
                  : typeof item.value === "number"
                    ? item.value.toLocaleString("vi-VN")
                    : String(item.value ?? "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
