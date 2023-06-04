import { BadgeDelta, Card, Flex, Grid, Metric, Text } from "@tremor/react";
import { dashboardStatColors } from "expensasaures/shared/constants/constants";
import { DashboardStat } from "expensasaures/shared/types/transaction";

interface Props {
  stats: DashboardStat[];
}

const DashboardStatistics = (props: Props) => {
  const { stats } = props;
  return (
    <Grid numColsSm={2} numColsLg={3} className="gap-6">
      {stats.map((item) => (
        <Card className='box-shadow-card' key={item.title}>
          <Text className="text-stone-600 font-medium">{item.title}</Text>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="truncate space-x-3"
          >
            <Metric className="text-slate-950">{item.metric}</Metric>
            {item.metricPrev && (
              <Text className="truncate">from {item.metricPrev}</Text>
            )}
          </Flex>

          <Flex justifyContent="start" className="space-x-2 mt-4">
            {item.deltaType && <BadgeDelta deltaType={item.deltaType} />}
            <Flex justifyContent="start" className="space-x-1 truncate">
              {item.delta && (
                <Text color={dashboardStatColors[item.deltaType]}>
                  {item.delta}
                </Text>
              )}
              <Text className="truncate"> to previous month </Text>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
};

const Skeleton = () => {
  return <div className="h-[144px] p-6 w-full relative overflow-hidden rounded-2xl bg-white/10 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-slate-100 before:bg-gradient-to-r before:from-transparent before:via-slate-50/50 before:to-transparent">
    <div className="h-[15px] bg-slate-500/20 rounded-full w-[100px] mb-2">&nbsp;</div>
    <div className="flex items-end mt-4">
      <div className="h-[20px] bg-slate-500/20 rounded-full w-[100px]">&nbsp;</div>
      <div className="h-[10px] bg-slate-400/20 rounded-full w-[100px] ml-2">&nbsp;</div>
    </div>
    <div className="flex mt-4 items-center gap-2">
      <div className="h-[20px] w-[40px] bg-slate-500/20 rounded-full">&nbsp;</div>
      <div className="h-[10px] bg-slate-500/20 rounded-full w-[100px]">&nbsp;</div>
    </div>
  </div>
}

export const DashboardStatisticsLoading = () => {
  return <div className="flex gap-6">
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </div>
}

export default DashboardStatistics;
