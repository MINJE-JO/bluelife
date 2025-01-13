# Database Schema Documentation

## Tables

### plans

프로젝트 일정을 저장하는 메인 테이블

#### Columns

| Column Name    | Type      | Constraints | Description |
|---------------|-----------|-------------|-------------|
| id            | uuid      | PK, default: gen_random_uuid() | 고유 식별자 |
| clerk_user_id | text      | NOT NULL    | Clerk 사용자 ID |
| start_year    | integer   | NOT NULL    | 시작 연도 |
| start_month   | integer   | NOT NULL, check (1-12) | 시작 월 |
| end_year      | integer   | NOT NULL    | 종료 연도 |
| end_month     | integer   | NOT NULL, check (1-12) | 종료 월 |
| duration      | integer   | NOT NULL    | 기간 (월 단위) |
| content       | text      | NOT NULL    | 프로젝트 이름/내용 |
| color         | text      | NOT NULL    | 프로젝트 색상 코드 |
| created_at    | timestamptz | NOT NULL, default: now() | 생성일시 |
| updated_at    | timestamptz | NOT NULL, default: now() | 수정일시 |

#### RLS Policies

| Policy Name | Operation | Using/With Check |
|------------|-----------|------------------|
| Users can view their own plans | SELECT | clerk_user_id = auth.uid() |
| Users can create their own plans | INSERT | clerk_user_id = auth.uid() |
| Users can update their own plans | UPDATE | clerk_user_id = auth.uid() |
| Users can delete their own plans | DELETE | clerk_user_id = auth.uid() |

#### Triggers

| Trigger Name | Timing | Event | Function |
|-------------|---------|--------|-----------|
| set_updated_at | BEFORE | UPDATE | handle_updated_at() |

## Functions

### handle_updated_at()

updated_at 컬럼을 자동으로 현재 시간으로 업데이트하는 트리거 함수

```sql
create or replace function public.handle_updated_at()
returns trigger as $$
begin
new.updated_at = now();
return new;
end;
$$ language plpgsql;
```