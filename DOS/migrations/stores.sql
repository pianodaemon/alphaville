--
-- Name: alter_user(integer, character varying, character varying, integer, boolean, character varying, character varying, integer[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _role_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _authorities integer[]) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit user                                             >>
    -- >> Version:     nina_fresa                                                   >>
    -- >> Date:        04/ago/2021                                                  >>
    -- >> Developer:   Omar Montes                                                  >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();
    last_id integer := 0;
	row_counter integer := 0;
	arr_len integer := 0;
	i integer := 0;

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _user_id = 0 THEN

            INSERT INTO users (
                username,
                passwd,
                role_id,
				disabled,
				first_name,
				last_name,
				last_touch_time,
                creation_time
            ) VALUES (
                _username,
                _passwd,
                _role_id,
				_disabled,
				_first_name,
				_last_name,
                current_moment,
                current_moment
            ) RETURNING id INTO last_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (last_id, _authorities[i]);
				end loop;

			end if;

        WHEN _user_id > 0 THEN

			if _passwd = '' then
				
				UPDATE users
				SET username = _username,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			else
				
				UPDATE users
				SET username = _username,
					passwd = _passwd,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			end if;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'user identifier % does not exist', _user_id;
			end if;

			delete from users_authorities where user_id = _user_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (_user_id, _authorities[i]);
				end loop;

			end if;

            -- Upon edition we return user id as last id
            last_id = _user_id;

        ELSE
            RAISE EXCEPTION 'negative user identifier % is unsupported', _user_id;

    END CASE;

    return ( last_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _role_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _authorities integer[]) OWNER TO postgres;








                title = _title,
                last_touch_time = current_moment
CREATE FUNCTION public.alter_patios(
    _patio_id INT,
    _code character varying,
    _title character varying
) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit user                                             >>
    -- >> Version:     Ver 1 patios                                                 >>
    -- >> Date:        19/ago/2021                                                  >>
    -- >> Developer:   Alvaro Gamez Chavez                                          >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _patio_id = 0 THEN

            INSERT INTO patios(
                code,
                title,
                last_touch_time,
                creation_time,
                blocked
            )VALUES(
                _code,
                _title,
                current_moment,
                current_moment,
                false
            );

        WHEN _patio_id > 0 THEN


            UPDATE patios
            SET code = _code,
            WHERE id = _patio_id;
            

        ELSE
            RAISE EXCEPTION 'negative user identifier % is unsupported', _patio_id;

    END CASE;

    return ( last_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;
--(-1,"column ""_code_patios"" does not exist")
